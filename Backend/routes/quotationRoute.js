import express from 'express'
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
  convertToInvoice,
} from '../controllers/quotationController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All quotation routes require authentication
router.use(authenticate)

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.get('/',        getQuotations)          // GET  /api/quotations
router.post('/',       createQuotation)        // POST /api/quotations
router.get('/:id',     getQuotationById)       // GET  /api/quotations/:id
router.put('/:id',     updateQuotation)        // PUT  /api/quotations/:id
router.delete('/:id',  deleteQuotation)        // DELETE /api/quotations/:id

// ── Status-only patch ─────────────────────────────────────────────────────────
router.patch('/:id/status', updateQuotationStatus)  // PATCH /api/quotations/:id/status

// ── Convert to invoice ────────────────────────────────────────────────────────
router.post('/:id/convert', convertToInvoice)       // POST  /api/quotations/:id/convert

export default router