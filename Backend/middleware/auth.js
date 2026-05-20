import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'vbill_secret_change_me'

// ── authenticate ─────────────────────────────────────────────
// Verifies the Bearer token and attaches req.user = { id, businessId, role }
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)   // throws if invalid/expired

    // Fetch fresh user so we always have current businessId + role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, businessId: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or deactivated.' })
    }

    req.user = user   // controllers access req.user.businessId, req.user.role
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ message: 'Invalid token.' })
  }
}

// ── requireRole ──────────────────────────────────────────────
// Usage: requireRole("ADMIN", "MANAGER")
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Insufficient permissions.' })
  }
  next()
}