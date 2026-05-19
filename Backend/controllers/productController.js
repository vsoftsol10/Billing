import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/products?businessId=xxx&search=xxx
export const getProducts = async (req, res) => {
  try {
    const { businessId, search } = req.query

    if (!businessId) return res.status(400).json({ error: 'businessId is required' })

    const products = await prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        ...(search && {
          name: { contains: search, mode: 'insensitive' }
        })
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    })

    if (!product) return res.status(404).json({ error: 'Product not found' })

    res.json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    console.log("📦 createProduct body:", req.body); // ← add this

    const {
      businessId, categoryId, name, sku, description,
      unit, sellingPrice, costPrice, taxPercent,
      stockQuantity, lowStockAlert, imageUrl, hsnCode
    } = req.body

    if (!businessId || !name || !sellingPrice) {
      return res.status(400).json({ error: 'businessId, name and sellingPrice are required' })
    }

    const product = await prisma.product.create({
      data: {
        businessId,
        categoryId:    categoryId    || null,
        name,
        sku:           sku           || null,
        description:   description   || null,
        unit:          unit          || 'PCS',
        sellingPrice:  parseFloat(sellingPrice),
        costPrice:     costPrice     ? parseFloat(costPrice)    : null,
        taxPercent:    taxPercent    ? parseFloat(taxPercent)   : 18,
        stockQuantity: stockQuantity ? parseInt(stockQuantity)  : 0,
        lowStockAlert: lowStockAlert ? parseInt(lowStockAlert)  : 10,
        imageUrl:      imageUrl      || null,
        hsnCode:       hsnCode       || null,
      }
    })

    res.status(201).json({ success: true, data: product })
  } catch (err) {
    console.error("❌ createProduct error:", err); // ← and this
    res.status(500).json({ error: err.message, details: err })
  }
}

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const {
      name, sku, description, unit, sellingPrice,
      costPrice, taxPercent, stockQuantity,
      lowStockAlert, imageUrl, hsnCode, categoryId, isActive
    } = req.body

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name          !== undefined && { name }),
        ...(sku           !== undefined && { sku }),
        ...(description   !== undefined && { description }),
        ...(unit          !== undefined && { unit }),
        ...(sellingPrice  !== undefined && { sellingPrice: parseFloat(sellingPrice) }),
        ...(costPrice     !== undefined && { costPrice:    parseFloat(costPrice) }),
        ...(taxPercent    !== undefined && { taxPercent:   parseFloat(taxPercent) }),
        ...(stockQuantity !== undefined && { stockQuantity: parseInt(stockQuantity) }),
        ...(lowStockAlert !== undefined && { lowStockAlert: parseInt(lowStockAlert) }),
        ...(imageUrl      !== undefined && { imageUrl }),
        ...(hsnCode       !== undefined && { hsnCode }),
        ...(categoryId    !== undefined && { categoryId }),
        ...(isActive      !== undefined && { isActive }),
      }
    })

    res.json({ success: true, data: product })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/products/:id  (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data:  { isActive: false }
    })

    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(500).json({ error: err.message })
  }
}

// GET /api/products/stats?businessId=xxx
export const getProductStats = async (req, res) => {
  try {
    const { businessId } = req.query

    if (!businessId) return res.status(400).json({ error: 'businessId is required' })

    const [total, lowStock, outOfStock] = await Promise.all([
      prisma.product.count({ where: { businessId, isActive: true } }),
      prisma.product.count({
        where: {
          businessId,
          isActive: true,
          stockQuantity: { lte: prisma.product.fields.lowStockAlert }
        }
      }),
      prisma.product.count({
        where: { businessId, isActive: true, stockQuantity: 0 }
      })
    ])

    res.json({ success: true, data: { total, lowStock, outOfStock } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}