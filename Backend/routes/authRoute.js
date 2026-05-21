// routes/authRoute.js  (replace your existing api/auth.js content with this)
// Key fix: signup now auto-creates a Business and links it to the user,
// so req.user.businessId is always set when the user hits any protected route.

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

const JWT_SECRET    = process.env.JWT_SECRET    || 'vbill_secret_change_me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const FRONTEND_URL  = process.env.FRONTEND_URL  || 'http://localhost:5173'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

const sendResetEmail = async (email, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from:    `"VBILL" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: 'Password Reset Request — VBILL',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #fde68a;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:24px;font-weight:bold;color:#1a1a1a;">V<span style="color:#f59e0b;">BILL</span></span>
        </div>
        <h2 style="color:#1a1a1a;margin-bottom:8px;">Reset Your Password</h2>
        <p style="color:#6b7280;font-size:14px;line-height:1.6;">
          Click the button below to reset your password. This link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:#f59e0b;color:#1a1a1a;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;display:inline-block;font-size:14px;">
            Reset Password →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  })
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, businessName } = req.body

    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // ── Create user + business in one transaction ─────────────────────────────
    // This guarantees req.user.businessId is NEVER null after login.
    const { user, business } = await prisma.$transaction(async (tx) => {
      // 1. Create the business first
      const biz = await tx.business.create({
        data: {
          name:          (businessName?.trim()) || `${fullName.trim()}'s Business`,
          currency:      'INR',
          invoicePrefix: 'INV',
          invoiceCount:  0,
        },
      })

      // 2. Create user linked to that business
      const u = await tx.user.create({
        data: {
          fullName:      fullName.trim(),
          email:         email.toLowerCase(),
          passwordHash,
          role:          'ADMIN',
          isActive:      true,
          emailVerified: false,
          businessId:    biz.id,
        },
        select: {
          id: true, fullName: true, email: true,
          role: true, businessId: true, createdAt: true,
        },
      })

      // 3. Link business back to user (businesses.users)
      await tx.business.update({
        where: { id: biz.id },
        data:  { users: { connect: { id: u.id } } },
      })

      return { user: u, business: biz }
    })

    const token        = generateToken(user.id)
    const sessionToken = crypto.randomBytes(32).toString('hex')

    await prisma.session.create({
      data: {
        userId:    user.id,
        token:     sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId:   user.id,
        action:   'USER_REGISTERED',
        entity:   'User',
        entityId: user.id,
        metadata: { email: user.email, businessId: business.id },
      },
    })

    return res.status(201).json({ message: 'Account created successfully.', token, user })
  } catch (err) {
    console.error('[SIGNUP ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true, fullName: true, email: true, role: true,
        passwordHash: true, isActive: true, avatarUrl: true, businessId: true,
      },
    })

    if (!user)          return res.status(401).json({ message: 'Invalid email or password.' })
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated. Contact support.' })

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' })

    // If an existing user somehow has no business, create one now
    let businessId = user.businessId
    if (!businessId) {
      const biz = await prisma.business.create({
        data: {
          name:          `${user.fullName}'s Business`,
          currency:      'INR',
          invoicePrefix: 'INV',
          invoiceCount:  0,
          users:         { connect: { id: user.id } },
        },
      })
      await prisma.user.update({ where: { id: user.id }, data: { businessId: biz.id } })
      businessId = biz.id
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const token        = generateToken(user.id)
    const sessionToken = crypto.randomBytes(32).toString('hex')

    await prisma.session.create({
      data: {
        userId:    user.id,
        token:     sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.auditLog.create({
      data: { userId: user.id, action: 'USER_LOGIN', entity: 'User', entityId: user.id },
    })

    const { passwordHash: _, ...safeUser } = user

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { ...safeUser, businessId },
    })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required.' })

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, fullName: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' })
    }

    await prisma.passwordReset.deleteMany({ where: { userId: user.id } })

    const resetToken  = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    await prisma.passwordReset.create({
      data: {
        userId:    user.id,
        token:     hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    await sendResetEmail(user.email, resetToken)

    return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required.' })
    if (newPassword.length < 6)  return res.status(400).json({ message: 'Password must be at least 6 characters.' })

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const resetRecord = await prisma.passwordReset.findUnique({
      where:   { token: hashedToken },
      include: { user: true },
    })

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetRecord.userId }, data: { passwordHash } }),
      prisma.passwordReset.update({ where: { token: hashedToken }, data: { usedAt: new Date() } }),
      prisma.session.deleteMany({ where: { userId: resetRecord.userId } }),
    ])

    return res.status(200).json({ message: 'Password reset successfully. Please log in.' })
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        await prisma.session.deleteMany({ where: { userId: decoded.userId } })
      } catch (_) { /* expired token — still OK */ }
    }
    return res.status(200).json({ message: 'Logged out successfully.' })
  } catch (err) {
    return res.status(500).json({ message: 'Logout failed.' })
  }
})

export default router