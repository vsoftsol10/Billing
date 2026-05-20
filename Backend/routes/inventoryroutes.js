import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  getInventory,
  getInventoryStats,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getStockMovements,
  getCategories,
  createCategory,
} from "../controllers/inventoryController.js";

const router = Router();

// All inventory routes require a valid session
router.use(authenticate);

// ── Stats ────────────────────────────────────────────────────
// GET /api/inventory/stats  → powers the 4 stat cards
router.get("/stats", getInventoryStats);

// ── Categories ───────────────────────────────────────────────
// GET  /api/inventory/categories      → StockModal dropdown
// POST /api/inventory/categories      → create category (ADMIN/MANAGER)
router.get( "/categories", getCategories);
router.post("/categories", requireRole("ADMIN", "MANAGER"), createCategory);

// ── Product list & create ────────────────────────────────────
// GET  /api/inventory          → InventoryTable (search, status filter, pagination)
// POST /api/inventory          → StockModal "Add Quantity" button
router.get( "/", getInventory);
router.post("/", requireRole("ADMIN", "MANAGER", "STAFF"), createProduct);

// ── Single product ───────────────────────────────────────────
// GET    /api/inventory/:id
// PATCH  /api/inventory/:id          → edit product details
// DELETE /api/inventory/:id          → soft-delete
router.get(   "/:id", getProductById);
router.patch( "/:id", requireRole("ADMIN", "MANAGER"), updateProduct);
router.delete("/:id", requireRole("ADMIN", "MANAGER"), deleteProduct);

// ── Stock movements ──────────────────────────────────────────
// POST /api/inventory/:id/stock-in   → "Stock In"  button in InventoryTable
// POST /api/inventory/:id/stock-out  → "Stock Out" button in InventoryTable
// GET  /api/inventory/:id/movements  → movement history
router.post("/:id/stock-in",   stockIn);
router.post("/:id/stock-out",  stockOut);
router.get( "/:id/movements",  getStockMovements);

export default router;