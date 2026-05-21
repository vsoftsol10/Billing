import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateInvoiceNumber = async (businessId) => {
  const business = await prisma.business.update({
    where: { id: businessId },
    data:  { invoiceCount: { increment: 1 } },
    select: { invoicePrefix: true, invoiceCount: true },
  })
  const year = new Date().getFullYear()
  const seq  = String(business.invoiceCount).padStart(4, '0')
  return `${business.invoicePrefix}-${year}-${seq}`
}

// Frontend label  ←→  DB enum
const STATUS_TO_DB = {
  Draft:     'DRAFT',
  Open:      'SENT',
  Paid:      'PAID',
  Pending:   'PARTIALLY_PAID',
  Overdue:   'OVERDUE',
  Cancelled: 'CANCELLED',
}
const STATUS_FROM_DB = {
  DRAFT:          'Draft',
  SENT:           'Open',
  PAID:           'Paid',
  PARTIALLY_PAID: 'Pending',
  OVERDUE:        'Overdue',
  CANCELLED:      'Cancelled',
}

const PAYMENT_MODE_TO_DB = {
  UPI: 'UPI', Cash: 'CASH', 'Bank Transfer': 'BANK_TRANSFER',
  Cheque: 'CHEQUE', Card: 'CARD', Other: 'OTHER',
}

// Shape DB row → InvoiceTable row format
const formatInvoice = (inv) => ({
  id:          inv.invoiceNumber,
  dbId:        inv.id,
  client:      inv.customer?.name   ?? '—',
  amount:      `₹${Number(inv.totalAmount).toLocaleString('en-IN')}`,
  date:        inv.issueDate.toISOString().split('T')[0],
  dueDate:     inv.dueDate ? inv.dueDate.toISOString().split('T')[0] : null,
  gstNo:       inv.customer?.gstin  ?? '—',
  status:      STATUS_FROM_DB[inv.status] ?? inv.status,
  subtotal:    Number(inv.subtotal),
  taxAmount:   Number(inv.taxAmount),
  totalAmount: Number(inv.totalAmount),
  paidAmount:  Number(inv.paidAmount),
  balanceDue:  Number(inv.balanceDue),
  notes:       inv.notes,
  terms:       inv.terms,
  items: (inv.items ?? []).map(item => ({
    id:          item.id,
    name:        item.name,
    description: item.description,
    hsn:         item.name,   // no separate hsn column on InvoiceItem
    qty:         Number(item.quantity),
    rate:        Number(item.unitPrice),
    taxPercent:  Number(item.taxPercent),
    amount:      Number(item.totalAmount),
  })),
})

// ─── GET /api/invoices ────────────────────────────────────────────────────────
export const listInvoices = async (req, res) => {
  try {
    const { search = '', status, fyStart, fyEnd, page = 1, limit = 10 } = req.query
    const businessId = req.user.businessId

    if (!businessId) return res.status(403).json({ message: 'No business linked to this account.' })

    const dbStatus = STATUS_TO_DB[status] ?? status

    const where = {
      businessId,
      ...(dbStatus && { status: dbStatus }),
      ...(fyStart && fyEnd && {
        issueDate: { gte: new Date(fyStart), lte: new Date(fyEnd + 'T23:59:59.999Z') },
      }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name:  { contains: search, mode: 'insensitive' } } },
          { customer: { gstin: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: { select: { name: true, gstin: true } },
          items:    true,
        },
        orderBy: { createdAt: 'desc' },
        skip:    (Number(page) - 1) * Number(limit),
        take:    Number(limit),
      }),
      prisma.invoice.count({ where }),
    ])

    res.json({ invoices: invoices.map(formatInvoice), total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    console.error('[LIST INVOICES]', err)
    res.status(500).json({ message: 'Failed to fetch invoices.' })
  }
}

// ─── GET /api/invoices/stats ──────────────────────────────────────────────────
export const getInvoiceStats = async (req, res) => {
  try {
    const businessId = req.user.businessId
    if (!businessId) return res.status(403).json({ message: 'No business linked to this account.' })

    const [total, pending, paid, overdue, draft, cancelled] = await Promise.all([
      prisma.invoice.count({ where: { businessId } }),
      prisma.invoice.count({ where: { businessId, status: 'PARTIALLY_PAID' } }),
      prisma.invoice.count({ where: { businessId, status: 'PAID' } }),
      prisma.invoice.count({ where: { businessId, status: 'OVERDUE' } }),
      prisma.invoice.count({ where: { businessId, status: 'DRAFT' } }),
      prisma.invoice.count({ where: { businessId, status: 'CANCELLED' } }),
    ])

    res.json({ total, pending, paid, overdue, draft, cancelled })
  } catch (err) {
    console.error('[INVOICE STATS]', err)
    res.status(500).json({ message: 'Failed to fetch stats.' })
  }
}

// ─── GET /api/invoices/:id ────────────────────────────────────────────────────
export const getInvoice = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
      include: {
        customer:  true,
        items:     true,
        payments:  { orderBy: { paidAt: 'desc' } },
        createdBy: { select: { fullName: true, email: true } },
      },
    })

    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' })
    res.json(formatInvoice(invoice))
  } catch (err) {
    console.error('[GET INVOICE]', err)
    res.status(500).json({ message: 'Failed to fetch invoice.' })
  }
}

// ─── POST /api/invoices ───────────────────────────────────────────────────────
// Body from CreateInvoice: { customerId, date, dueDate, items, note, terms, paymentAmount, paymentMode, gstRate }
export const createInvoice = async (req, res) => {
  try {
    const businessId = req.user.businessId
    if (!businessId) return res.status(403).json({ message: 'No business linked to this account.' })

    const {
      customerId,
      date,
      dueDate,
      items        = [],
      note,
      terms,
      paymentAmount = 0,
      paymentMode   = 'UPI',
      gstRate       = 9,
    } = req.body

    if (!customerId) return res.status(400).json({ message: 'customerId is required.' })
    // Allow empty items only for drafts; require at least one item otherwise
    const isDraft = req.body.isDraft === true
    if (!isDraft && !items.length) return res.status(400).json({ message: 'At least one item is required.' })

    // Verify customer belongs to this business
    const customer = await prisma.customer.findFirst({ where: { id: customerId, businessId } })
    if (!customer) return res.status(404).json({ message: 'Customer not found.' })

    // Compute totals
    const subtotal    = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
    const cgst        = (subtotal * gstRate) / 100
    const sgst        = (subtotal * gstRate) / 100
    const taxAmount   = cgst + sgst
    const totalAmount = subtotal + taxAmount
    const paid        = Math.min(Number(paymentAmount), totalAmount)
    const balanceDue  = totalAmount - paid

    // Auto-derive status
    let status = 'SENT'
    if (isDraft)                                                  status = 'DRAFT'
    else if (paid >= totalAmount)                                 status = 'PAID'
    else if (paid > 0)                                            status = 'PARTIALLY_PAID'
    else if (dueDate && new Date(dueDate) < new Date())           status = 'OVERDUE'

    const invoiceNumber = await generateInvoiceNumber(businessId)

    const itemsPayload = items.map((it, idx) => {
      const lineSubtotal = Number(it.qty) * Number(it.rate)
      const lineTaxPct   = Number(it.taxPercent ?? gstRate * 2)
      const lineTax      = (lineSubtotal * lineTaxPct) / 100
      return {
        name:        it.name,
        description: it.description  || null,
        quantity:    Number(it.qty),
        unit:        it.unit         || 'PCS',
        unitPrice:   Number(it.rate),
        discount:    Number(it.discount ?? 0),
        taxPercent:  lineTaxPct,
        taxAmount:   lineTax,
        totalAmount: lineSubtotal + lineTax,
        sortOrder:   idx,
        ...(it.productId && { product: { connect: { id: it.productId } } }),
      }
    })

    const invoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          businessId,
          customerId,
          createdById:   req.user.id,
          invoiceNumber,
          status,
          issueDate:     date    ? new Date(date)    : new Date(),
          dueDate:       dueDate ? new Date(dueDate) : null,
          subtotal,
          discountAmount: 0,
          taxAmount,
          totalAmount,
          paidAmount:    paid,
          balanceDue,
          notes:  note  || null,
          terms:  terms || null,
          items:  { create: itemsPayload },
        },
        include: { customer: true, items: true },
      })

      if (paid > 0) {
        await tx.payment.create({
          data: {
            invoiceId:    inv.id,
            recordedById: req.user.id,
            amount:       paid,
            method:       PAYMENT_MODE_TO_DB[paymentMode] ?? 'CASH',
            status:       'COMPLETED',
            paidAt:       new Date(),
          },
        })
      }

      await tx.customer.update({
        where: { id: customerId },
        data: {
          totalBilled: { increment: totalAmount },
          totalPaid:   { increment: paid },
        },
      })

      return inv
    })

    res.status(201).json(formatInvoice(invoice))
  } catch (err) {
    console.error('[CREATE INVOICE]', err)
    res.status(500).json({ message: 'Failed to create invoice.' })
  }
}

// ─── PATCH /api/invoices/:id/status ──────────────────────────────────────────
// Body: { status: 'Paid' | 'Pending' | 'Open' | 'Draft' | 'Cancelled' }
// Used by StatusDropdown onChange in InvoiceTable
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ message: 'status is required.' })

    const dbStatus = STATUS_TO_DB[status] ?? status
    const valid    = ['DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED']
    if (!valid.includes(dbStatus)) return res.status(400).json({ message: `Invalid status: ${status}` })

    const existing = await prisma.invoice.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!existing) return res.status(404).json({ message: 'Invoice not found.' })

    const invoice = await prisma.invoice.update({
      where:   { id: req.params.id },
      data:    { status: dbStatus },
      include: { customer: true, items: true },
    })

    res.json(formatInvoice(invoice))
  } catch (err) {
    console.error('[UPDATE STATUS]', err)
    res.status(500).json({ message: 'Failed to update status.' })
  }
}

// ─── PUT /api/invoices/:id ────────────────────────────────────────────────────
export const updateInvoice = async (req, res) => {
  try {
    const { customerId, date, dueDate, items = [], note, terms, gstRate = 9 } = req.body

    const existing = await prisma.invoice.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!existing) return res.status(404).json({ message: 'Invoice not found.' })

    const subtotal    = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
    const taxAmount   = (subtotal * gstRate * 2) / 100
    const totalAmount = subtotal + taxAmount
    const balanceDue  = Math.max(0, totalAmount - Number(existing.paidAmount))

    const itemsPayload = items.map((it, idx) => {
      const lineSubtotal = Number(it.qty) * Number(it.rate)
      const lineTaxPct   = Number(it.taxPercent ?? gstRate * 2)
      const lineTax      = (lineSubtotal * lineTaxPct) / 100
      return {
        name:        it.name,
        description: it.description || null,
        quantity:    Number(it.qty),
        unit:        it.unit || 'PCS',
        unitPrice:   Number(it.rate),
        discount:    Number(it.discount ?? 0),
        taxPercent:  lineTaxPct,
        taxAmount:   lineTax,
        totalAmount: lineSubtotal + lineTax,
        sortOrder:   idx,
      }
    })

    const invoice = await prisma.$transaction(async (tx) => {
      await tx.invoiceItem.deleteMany({ where: { invoiceId: req.params.id } })
      return tx.invoice.update({
        where: { id: req.params.id },
        data: {
          ...(customerId && { customerId }),
          issueDate:  date    ? new Date(date)    : undefined,
          dueDate:    dueDate ? new Date(dueDate) : null,
          subtotal, taxAmount, totalAmount, balanceDue,
          notes: note  ?? null,
          terms: terms ?? null,
          items: { create: itemsPayload },
        },
        include: { customer: true, items: true },
      })
    })

    res.json(formatInvoice(invoice))
  } catch (err) {
    console.error('[UPDATE INVOICE]', err)
    res.status(500).json({ message: 'Failed to update invoice.' })
  }
}

// ─── DELETE /api/invoices/:id ─────────────────────────────────────────────────
// Soft-cancel — used by ActionDropdown → Delete
export const deleteInvoice = async (req, res) => {
  try {
    const existing = await prisma.invoice.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!existing) return res.status(404).json({ message: 'Invoice not found.' })

    const invoice = await prisma.invoice.update({
      where:   { id: req.params.id },
      data:    { status: 'CANCELLED' },
      include: { customer: true, items: true },
    })

    res.json({ message: 'Invoice cancelled.', invoice: formatInvoice(invoice) })
  } catch (err) {
    console.error('[DELETE INVOICE]', err)
    res.status(500).json({ message: 'Failed to delete invoice.' })
  }
}