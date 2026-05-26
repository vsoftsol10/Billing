import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js'
import purchaseRouter from './routes/purchaseRoute.js'
import productRouter from './routes/productRoute.js'
import inventoryRouter from './routes/inventoryroutes.js'
import invoiceRouter from './routes/invoiceRoute.js'
import customerRouter from './routes/customerRoute.js'
import quotationRouter from './routes/quotationRoute.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth',       authRouter)
app.use('/api/purchases',  purchaseRouter)
app.use('/api/products',   productRouter)
app.use('/api/inventory',  inventoryRouter)
app.use('/api/invoices',   invoiceRouter)
app.use('/api/customers',  customerRouter)
app.use('/api/quotations', quotationRouter)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'VBILL API is running' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})