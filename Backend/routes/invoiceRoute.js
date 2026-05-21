import { Router } from 'express'
import {
  listInvoices,
  getInvoiceStats,
  getInvoice,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} from '../controllers/invoiceController.js'
import { listPayments, recordPayment } from '../controllers/paymentController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

// /stats must be before /:id so Express doesn't treat "stats" as an id
router.get   ('/stats',        getInvoiceStats)
router.get   ('/',             listInvoices)
router.post  ('/',             createInvoice)
router.get   ('/:id',          getInvoice)
router.put   ('/:id',          updateInvoice)
router.patch ('/:id/status',   updateInvoiceStatus)
router.delete('/:id',          deleteInvoice)

// Payments nested under invoice
router.get   ('/:id/payments', listPayments)
router.post  ('/:id/payments', recordPayment)

export default router