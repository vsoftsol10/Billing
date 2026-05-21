import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PAYMENT_MODE_TO_DB = {
  UPI: 'UPI', Cash: 'CASH', 'Bank Transfer': 'BANK_TRANSFER',
  Cheque: 'CHEQUE', Card: 'CARD', Other: 'OTHER',
}

// ─── GET /api/invoices/:id/payments ──────────────────────────────────────────
export const listPayments = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' })

    const payments = await prisma.payment.findMany({
      where:   { invoiceId: req.params.id },
      orderBy: { paidAt: 'desc' },
      include: { recordedBy: { select: { fullName: true } } },
    })

    res.json(payments)
  } catch (err) {
    console.error('[LIST PAYMENTS]', err)
    res.status(500).json({ message: 'Failed to fetch payments.' })
  }
}

// ─── POST /api/invoices/:id/payments ─────────────────────────────────────────
// Body: { amount, method, transactionRef?, notes?, paidAt? }
export const recordPayment = async (req, res) => {
  try {
    const { amount, method = 'Cash', transactionRef, notes, paidAt } = req.body

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'amount must be a positive number.' })
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' })

    if (invoice.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Cannot record payment on a cancelled invoice.' })
    }

    const newPaid    = Number(invoice.paidAmount) + Number(amount)
    const balanceDue = Math.max(0, Number(invoice.totalAmount) - newPaid)
    const newStatus  = balanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID'

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoiceId:      req.params.id,
          recordedById:   req.user.id,
          amount:         Number(amount),
          method:         PAYMENT_MODE_TO_DB[method] ?? 'CASH',
          status:         'COMPLETED',
          transactionRef: transactionRef || null,
          notes:          notes          || null,
          paidAt:         paidAt ? new Date(paidAt) : new Date(),
        },
      }),
      prisma.invoice.update({
        where: { id: req.params.id },
        data:  { paidAmount: newPaid, balanceDue, status: newStatus },
      }),
      prisma.customer.update({
        where: { id: invoice.customerId },
        data:  { totalPaid: { increment: Number(amount) } },
      }),
    ])

    res.status(201).json(payment)
  } catch (err) {
    console.error('[RECORD PAYMENT]', err)
    res.status(500).json({ message: 'Failed to record payment.' })
  }
}