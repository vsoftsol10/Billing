import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from '../controllers/productController.js'

const productRouter = express.Router()

productRouter.get('/stats',  getProductStats)   // GET  /api/products/stats
productRouter.get('/',       getProducts)        // GET  /api/products
productRouter.get('/:id',    getProductById)     // GET  /api/products/:id
productRouter.post('/',      createProduct)      // POST /api/products
productRouter.put('/:id',    updateProduct)      // PUT  /api/products/:id
productRouter.delete('/:id', deleteProduct)      // DELETE /api/products/:id

export default productRouter