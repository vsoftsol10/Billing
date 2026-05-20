import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// GET /api/inventory
// Returns paginated product list with optional search + status filter
// Query params: search, status, page, limit
// ─────────────────────────────────────────────────────────────
export const getInventory = async (req, res) => {
  try {
    const { search = "", status = "All", page = 1, limit = 20 } = req.query;
    const businessId = req.user.businessId;

    const skip = (Number(page) - 1) * Number(limit);

    // Build dynamic where clause
    const where = {
      businessId,
      isActive: true,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
      // Map UI status values → DB stock levels
      ...(status === "Pending" && {
        stockQuantity: { gt: 0, lte: 10 },          // low stock
      }),
      ...(status === "Open" && {
        stockQuantity: { gt: 10 },                   // healthy stock
      }),
      ...(status === "Update" && {
        stockQuantity: { equals: 0 },                // out of stock
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Map DB rows → shape the frontend InventoryTable expects
    const items = products.map((p) => ({
      id:            p.id,
      name:          p.name,
      sku:           p.sku,
      qty:           String(p.stockQuantity).padStart(2, "0"),
      unit:          p.unit,
      salesPrice:    `₹ ${Number(p.sellingPrice).toLocaleString("en-IN")}`,
      purchasePrice: p.costPrice
        ? `₹ ${Number(p.costPrice).toLocaleString("en-IN")}`
        : "—",
      date:          p.createdAt.toISOString().slice(0, 10),
      category:      p.category?.name ?? null,
      categoryId:    p.categoryId,
      status:        deriveStatus(p.stockQuantity, p.lowStockAlert),
      lowStockAlert: p.lowStockAlert,
      isActive:      p.isActive,
    }));

    return res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("[getInventory]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch inventory" });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/stats
// Powers the 4 stat cards: stock value, total products,
// low stock count, out-of-stock count
// ─────────────────────────────────────────────────────────────
export const getInventoryStats = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    const [products, prevMonthProducts] = await Promise.all([
      prisma.product.findMany({
        where: { businessId, isActive: true },
        select: {
          sellingPrice:  true,
          stockQuantity: true,
          lowStockAlert: true,
          createdAt:     true,
        },
      }),
      prisma.product.count({
        where: {
          businessId,
          isActive:  true,
          createdAt: { lt: startOfCurrentMonth() },
        },
      }),
    ]);

    const totalProducts   = products.length;
    const outOfStock      = products.filter((p) => p.stockQuantity === 0).length;
    const lowStock        = products.filter(
      (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockAlert
    ).length;
    const stockValue      = products.reduce(
      (sum, p) => sum + Number(p.sellingPrice) * p.stockQuantity,
      0
    );

    const newThisMonth    = totalProducts - prevMonthProducts;

    return res.json({
      success: true,
      data: {
        stockValue:    `₹ ${stockValue.toLocaleString("en-IN")}`,
        totalProducts,
        lowStock,
        outOfStock,
        newThisMonth,                        // "+17 last month" style sub-text
      },
    });
  } catch (err) {
    console.error("[getInventoryStats]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id
// Single product detail
// ─────────────────────────────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const product = await prisma.product.findFirst({
      where: { id, businessId },
      include: {
        category:      { select: { id: true, name: true } },
        stockMovements: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, data: product });
  } catch (err) {
    console.error("[getProductById]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/inventory
// Add a new product (called from StockModal → "Add Quantity")
// Body: { name, sku, categoryId, unit, sellingPrice, costPrice,
//         stockQuantity, lowStockAlert, hsnCode, description, remark }
// ─────────────────────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const {
      name,
      sku,
      categoryId,
      unit          = "PCS",
      sellingPrice,
      costPrice,
      stockQuantity = 0,
      lowStockAlert = 10,
      hsnCode,
      description,
      remark,
    } = req.body;

    // Basic validation
    if (!name)         return res.status(400).json({ success: false, message: "name is required" });
    if (!sellingPrice) return res.status(400).json({ success: false, message: "sellingPrice is required" });

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          businessId,
          name,
          sku:           sku || null,
          categoryId:    categoryId || null,
          unit,
          sellingPrice:  Number(sellingPrice),
          costPrice:     costPrice ? Number(costPrice) : null,
          stockQuantity: Number(stockQuantity),
          lowStockAlert: Number(lowStockAlert),
          hsnCode:       hsnCode || null,
          description:   description || remark || null,
        },
        include: { category: { select: { id: true, name: true } } },
      });

      // Record initial stock movement if opening stock > 0
      if (Number(stockQuantity) > 0) {
        await tx.stockMovement.create({
          data: {
            productId:      created.id,
            type:           "ADJUSTMENT",
            quantity:       Number(stockQuantity),
            quantityBefore: 0,
            quantityAfter:  Number(stockQuantity),
            notes:          "Opening stock",
          },
        });
      }

      return created;
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data:    product,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "SKU already exists for this business" });
    }
    console.error("[createProduct]", err);
    return res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/inventory/:id
// Update product fields (name, price, category, lowStockAlert…)
// ─────────────────────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    // Guard: only touch products that belong to this business
    const existing = await prisma.product.findFirst({ where: { id, businessId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const {
      name, sku, categoryId, unit,
      sellingPrice, costPrice,
      lowStockAlert, hsnCode, description, isActive,
    } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name         !== undefined && { name }),
        ...(sku          !== undefined && { sku }),
        ...(categoryId   !== undefined && { categoryId }),
        ...(unit         !== undefined && { unit }),
        ...(sellingPrice !== undefined && { sellingPrice: Number(sellingPrice) }),
        ...(costPrice    !== undefined && { costPrice: Number(costPrice) }),
        ...(lowStockAlert!== undefined && { lowStockAlert: Number(lowStockAlert) }),
        ...(hsnCode      !== undefined && { hsnCode }),
        ...(description  !== undefined && { description }),
        ...(isActive     !== undefined && { isActive }),
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return res.json({ success: true, message: "Product updated", data: updated });
  } catch (err) {
    console.error("[updateProduct]", err);
    return res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/inventory/:id/stock-in
// Increase stock — called by the "Stock In" button in the table
// Body: { quantity, reference, notes }
// ─────────────────────────────────────────────────────────────
export const stockIn = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;
    const { quantity, reference, notes } = req.body;

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: "quantity must be a positive number" });
    }

    const product = await prisma.product.findFirst({ where: { id, businessId } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const qty    = Number(quantity);
    const before = product.stockQuantity;
    const after  = before + qty;

    const [updatedProduct, movement] = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data:  { stockQuantity: after },
      }),
      prisma.stockMovement.create({
        data: {
          productId:      id,
          type:           "PURCHASE",
          quantity:       qty,
          quantityBefore: before,
          quantityAfter:  after,
          reference:      reference || null,
          notes:          notes || null,
        },
      }),
    ]);

    return res.json({
      success:  true,
      message:  `Stock increased by ${qty}`,
      data: {
        productId:     id,
        newQuantity:   updatedProduct.stockQuantity,
        movement,
      },
    });
  } catch (err) {
    console.error("[stockIn]", err);
    return res.status(500).json({ success: false, message: "Failed to process stock in" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/inventory/:id/stock-out
// Decrease stock — called by the "Stock Out" button in the table
// Body: { quantity, reference, notes }
// ─────────────────────────────────────────────────────────────
export const stockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;
    const { quantity, reference, notes } = req.body;

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: "quantity must be a positive number" });
    }

    const product = await prisma.product.findFirst({ where: { id, businessId } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const qty    = Number(quantity);
    const before = product.stockQuantity;

    if (before < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${before}, Requested: ${qty}`,
      });
    }

    const after = before - qty;

    const [updatedProduct, movement] = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data:  { stockQuantity: after },
      }),
      prisma.stockMovement.create({
        data: {
          productId:      id,
          type:           "SALE",
          quantity:       qty,
          quantityBefore: before,
          quantityAfter:  after,
          reference:      reference || null,
          notes:          notes || null,
        },
      }),
    ]);

    return res.json({
      success: true,
      message: `Stock decreased by ${qty}`,
      data: {
        productId:   id,
        newQuantity: updatedProduct.stockQuantity,
        movement,
      },
    });
  } catch (err) {
    console.error("[stockOut]", err);
    return res.status(500).json({ success: false, message: "Failed to process stock out" });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/inventory/:id
// Soft-delete (sets isActive = false)
// ─────────────────────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const existing = await prisma.product.findFirst({ where: { id, businessId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await prisma.product.update({
      where: { id },
      data:  { isActive: false },
    });

    return res.json({ success: true, message: "Product removed from inventory" });
  } catch (err) {
    console.error("[deleteProduct]", err);
    return res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id/movements
// Stock movement history for a product
// ─────────────────────────────────────────────────────────────
export const getStockMovements = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;
    const { page = 1, limit = 20 } = req.query;

    const product = await prisma.product.findFirst({
      where: { id, businessId },
      select: { id: true },
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where:   { productId: id },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.stockMovement.count({ where: { productId: id } }),
    ]);

    return res.json({
      success: true,
      data: movements,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("[getStockMovements]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch movements" });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/categories
// All categories for this business (used in StockModal dropdown)
// ─────────────────────────────────────────────────────────────
export const getCategories = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    const categories = await prisma.category.findMany({
      where:   { businessId },
      orderBy: { name: "asc" },
      select:  { id: true, name: true, description: true },
    });

    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error("[getCategories]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/inventory/categories
// Create a new category
// ─────────────────────────────────────────────────────────────
export const createCategory = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "name is required" });

    const category = await prisma.category.create({
      data: { businessId, name, description: description || null },
    });

    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }
    console.error("[createCategory]", err);
    return res.status(500).json({ success: false, message: "Failed to create category" });
  }
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Map stock quantity → the 3 UI status labels used in InventoryTable
 *   Pending → low stock (qty between 1 and lowStockAlert)
 *   Open    → healthy stock
 *   Update  → out of stock
 */
function deriveStatus(stockQuantity, lowStockAlert = 10) {
  if (stockQuantity === 0)                        return "Update";   // out of stock
  if (stockQuantity <= lowStockAlert)             return "Pending";  // low stock
  return "Open";                                                     // healthy
}

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}