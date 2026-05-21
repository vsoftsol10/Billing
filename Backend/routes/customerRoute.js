import { Router } from 'express'
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.get   ('/',    listCustomers)
router.post  ('/',    createCustomer)
router.get   ('/:id', getCustomer)
router.put   ('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)

export default router