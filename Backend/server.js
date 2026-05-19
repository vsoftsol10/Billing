import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js'
import purchaseRouter from './routes/purchaseRoute.js'
import productRouter from './routes/productRoute.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/purchases', purchaseRouter)
app.use('/api/products', productRouter)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'VBILL API is running' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})