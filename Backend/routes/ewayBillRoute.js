import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  connectGSP,
  getConnectionStatus,
  disconnectGSP,
  generateEWayBill,
  listEWayBills,          // ✅ new
} from '../controllers/ewayBillController.js'

const ewayBillRouter = express.Router()

ewayBillRouter.get('/',              authenticate, listEWayBills)      // ✅ new — GET /api/ewaybill
ewayBillRouter.post('/connect',      authenticate, connectGSP)
ewayBillRouter.get('/status',        authenticate, getConnectionStatus)
ewayBillRouter.delete('/disconnect', authenticate, disconnectGSP)
ewayBillRouter.post('/generate',     authenticate, generateEWayBill)

export default ewayBillRouter