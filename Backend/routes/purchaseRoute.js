import express from 'express'
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  saveDraft,
  updatePurchase,
  updateStatus,
  updateMode,
  deletePurchase,
} from '../controllers/purchaseController.js'

const router = express.Router()

// ── Purchase CRUD ─────────────────────────────────────────────────────────────
router.get   ('/',           getAllPurchases)   // GET    /api/purchases
router.get   ('/:id',        getPurchaseById)   // GET    /api/purchases/:id
router.post  ('/',           createPurchase)    // POST   /api/purchases
router.post  ('/draft',      saveDraft)         // POST   /api/purchases/draft
router.put   ('/:id',        updatePurchase)    // PUT    /api/purchases/:id
router.delete('/:id',        deletePurchase)    // DELETE /api/purchases/:id

// ── Inline field updates (PurchaseTable dropdowns) ────────────────────────────
router.patch ('/:id/status', updateStatus)      // PATCH  /api/purchases/:id/status
router.patch ('/:id/mode',   updateMode)        // PATCH  /api/purchases/:id/mode

export default router