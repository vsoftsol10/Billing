// ============================================================
// VBILL — Auth API Routes (Express + Prisma)
// File: api/auth.js
// ============================================================
// Install deps: npm install express prisma @prisma/client bcryptjs jsonwebtoken nodemailer crypto dotenv cors
// Usage: mount in your main server.js as app.use('/api/auth', authRouter)
// ============================================================

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// ── Env vars required ────────────────────────────────────────
// JWT_SECRET=your_jwt_secret_here
// JWT_EXPIRES_IN=7d
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_USER=your@email.com
// SMTP_PASS=your_app_password
// FRONTEND_URL=http://localhost:5173
// ─────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'vbill_secret_change_me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// ── Nodemailer transporter ───────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ── Helper: generate JWT ─────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

// ── Helper: send reset email ─────────────────────────────────
const sendResetEmail = async (email, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `"VBILL" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset Request — VBILL',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #fde68a;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:24px;font-weight:bold;color:#1a1a1a;">V<span style="color:#f59e0b;">BILL</span></span>
        </div>
        <h2 style="color:#1a1a1a;margin-bottom:8px;">Reset Your Password</h2>
        <p style="color:#6b7280;font-size:14px;line-height:1.6;">
          You requested a password reset. Click the button below to create a new password.
          This link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}"
            style="background:#f59e0b;color:#1a1a1a;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;display:inline-block;font-size:14px;">
            Reset Password →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

// ============================================================
// POST /api/auth/signup
// Body: { fullName, email, password }
// ============================================================
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    // ── Validation ───────────────────────────────────────────
    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    // ── Check duplicate email ────────────────────────────────
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    // ── Hash password ────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12)

    // ── Create user (no business yet — can be set up later) ──
    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        passwordHash,
        role: 'ADMIN', // First user of an account is admin
        isActive: true,
        emailVerified: false,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // ── Create session + JWT ─────────────────────────────────
    const token = generateToken(user.id)
    const sessionToken = crypto.randomBytes(32).toString('hex')

    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    // ── Audit log ────────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        entity: 'User',
        entityId: user.id,
        metadata: { email: user.email },
      },
    })

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user,
    })
  } catch (err) {
    console.error('[SIGNUP ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ============================================================
// POST /api/auth/login
// Body: { email, password }
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    // ── Find user ────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        avatarUrl: true,
        businessId: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support.' })
    }

    // ── Verify password ──────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // ── Update lastLoginAt ───────────────────────────────────
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // ── Create session ───────────────────────────────────────
    const token = generateToken(user.id)
    const sessionToken = crypto.randomBytes(32).toString('hex')

    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    // ── Audit log ────────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
      },
    })

    const { passwordHash: _, ...safeUser } = user

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: safeUser,
    })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ============================================================
// POST /api/auth/forgot-password
// Body: { email }
// ============================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, fullName: true, isActive: true },
    })

    // Always return success (don't reveal if email exists)
    if (!user || !user.isActive) {
      return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' })
    }

    // ── Invalidate old tokens ────────────────────────────────
    await prisma.passwordReset.deleteMany({ where: { userId: user.id } })

    // ── Create reset token (expires in 1 hour) ───────────────
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    // ── Send email ───────────────────────────────────────────
    await sendResetEmail(user.email, resetToken) // send plain token in URL

    return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ============================================================
// POST /api/auth/reset-password
// Body: { token, newPassword }
// ============================================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    // ── Hash the incoming token to match stored hash ─────────
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    })

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' })
    }

    // ── Update password ──────────────────────────────────────
    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { token: hashedToken },
        data: { usedAt: new Date() },
      }),
      // Invalidate all sessions on password reset
      prisma.session.deleteMany({ where: { userId: resetRecord.userId } }),
    ])

    return res.status(200).json({ message: 'Password reset successfully. Please log in.' })
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

// ============================================================
// POST /api/auth/logout
// Header: Authorization: Bearer <token>
// ============================================================
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        await prisma.session.deleteMany({ where: { userId: decoded.userId } })
      } catch (_) { /* token expired, still OK */ }
    }
    return res.status(200).json({ message: 'Logged out successfully.' })
  } catch (err) {
    return res.status(500).json({ message: 'Logout failed.' })
  }
})

export default router