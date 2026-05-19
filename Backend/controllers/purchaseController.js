import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── Helpers ───────────────────────────────────────────────────────────────────

const generatePurchaseNumber = () => {
  const year = new Date().getFullYear()
  const num  = Math.floor(1000 + Math.random() * 9000)
  return `PUR-${year}-${num}`
}

const buildTotals = (items = []) => {
  const subtotal = items.reduce((sum, item) => {
    const qty  = parseFloat(item.qty)  || 0
    const rate = parseFloat(item.rate) || 0
    return sum + qty * rate
  }, 0)
  const cgst  = parseFloat((subtotal * 0.09).toFixed(2))
  const sgst  = parseFloat((subtotal * 0.09).toFixed(2))
  const total = parseFloat((subtotal + cgst + sgst).toFixed(2))
  return { subtotal: parseFloat(subtotal.toFixed(2)), cgst, sgst, totalAmount: total }
}

// ── GET /api/purchases ────────────────────────────────────────────────────────
export const getAllPurchases = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20, businessId } = req.query

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' })
    }

    const where = {
      businessId,
      ...(status && status !== 'All' && { status: status.toUpperCase() }),
      ...(search && {
        OR: [
          { purchaseNumber: { contains: search, mode: 'insensitive' } },
          { supplier: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        include: {
          supplier:  { select: { id: true, name: true, gstin: true } },
          createdBy: { select: { id: true, fullName: true } },
          items:     { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.purchase.count({ where }),
    ])

    res.json({
      data: purchases,
      meta: {
        total,
        page:  parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (err) {
    console.error('getAllPurchases:', err)
    res.status(500).json({ error: 'Failed to fetch purchases' })
  }
}

// ── GET /api/purchases/:id ────────────────────────────────────────────────────
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id },
      include: {
        supplier:  true,
        createdBy: { select: { id: true, fullName: true, email: true } },
        items:     { orderBy: { sortOrder: 'asc' } },
      },
    })

    if (!purchase) return res.status(404).json({ error: 'Purchase not found' })
    res.json(purchase)
  } catch (err) {
    console.error('getPurchaseById:', err)
    res.status(500).json({ error: 'Failed to fetch purchase' })
  }
}

// ── POST /api/purchases ───────────────────────────────────────────────────────
export const createPurchase = async (req, res) => {
  try {
    const {
      businessId,
      createdById,
      vendor,               // { name, email, phone, gst, address } from CreatePurchase form
      supplierId,           // optional — if a saved supplier was selected
      items = [],
      note,
      terms,
      paymentMode = 'CASH',
      purchaseDate,
      status = 'PENDING',
    } = req.body

    if (!businessId || !createdById) {
      return res.status(400).json({ error: 'businessId and createdById are required' })
    }
    if (items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' })
    }

    // Auto-create supplier from vendor form data if no supplierId provided
    let resolvedSupplierId = supplierId || null
    if (!supplierId && vendor?.name) {
      const newSupplier = await prisma.supplier.create({
        data: {
          businessId,
          name:    vendor.name,
          email:   vendor.email   || null,
          phone:   vendor.phone   || null,
          gstin:   vendor.gst     || null,
          address: vendor.address || null,
        },
      })
      resolvedSupplierId = newSupplier.id
    }

    const purchaseNumber = generatePurchaseNumber()
    const { subtotal, cgst, sgst, totalAmount } = buildTotals(items)

    const purchase = await prisma.purchase.create({
      data: {
        businessId,
        createdById,
        supplierId:   resolvedSupplierId,
        purchaseNumber,
        status:       status.toUpperCase(),
        payment_mode:  paymentMode.toUpperCase().replace(/ /g, '_'),
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        subtotal,
        cgst,
        sgst,
        totalAmount,
        notes: note  || null,
        terms: terms || null,
        items: {
          create: items.map((item, index) => ({
            productId:   item.productId   || null,
            name:        item.name,
            description: item.description || null,
            hsnCode:     item.hsn         || null,
            quantity:    parseFloat(item.qty)    || 0,
            unitRate:    parseFloat(item.rate)   || 0,
            amount:      parseFloat(item.amount) || 0,
            sortOrder:   index,
          })),
        },
      },
      include: { supplier: true, items: true },
    })

    res.status(201).json(purchase)
  } catch (err) {
    console.error('createPurchase:', err)
    res.status(500).json({ error: 'Failed to create purchase' })
  }
}

// ── POST /api/purchases/draft ─────────────────────────────────────────────────
export const saveDraft = async (req, res) => {
  req.body.status = 'DRAFT'
  return createPurchase(req, res)
}

// ── PUT /api/purchases/:id ────────────────────────────────────────────────────
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params
    const {
      items = [],
      note,
      terms,
      paymentMode,
      purchaseDate,
      status,
      vendor,
      supplierId,
      businessId,
    } = req.body

    const existing = await prisma.purchase.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Purchase not found' })

    let resolvedSupplierId = supplierId || existing.supplierId
    if (!supplierId && vendor?.name) {
      const newSupplier = await prisma.supplier.create({
        data: {
          businessId: businessId || existing.businessId,
          name:    vendor.name,
          email:   vendor.email   || null,
          phone:   vendor.phone   || null,
          gstin:   vendor.gst     || null,
          address: vendor.address || null,
        },
      })
      resolvedSupplierId = newSupplier.id
    }

    const totals = items.length
      ? buildTotals(items)
      : { subtotal: existing.subtotal, cgst: existing.cgst, sgst: existing.sgst, totalAmount: existing.totalAmount }

    // Replace all items
    await prisma.purchaseItem.deleteMany({ where: { purchaseId: id } })

    const purchase = await prisma.purchase.update({
      where: { id },
      data: {
        supplierId:   resolvedSupplierId,
        status:       status      ? status.toUpperCase()                        : existing.status,
        payment_mode:  paymentMode ? paymentMode.toUpperCase().replace(/ /g, '_') : existing.payment_mode,
        purchaseDate: purchaseDate ? new Date(purchaseDate)                     : existing.purchaseDate,
        subtotal:     totals.subtotal,
        cgst:         totals.cgst,
        sgst:         totals.sgst,
        totalAmount:  totals.totalAmount,
        notes: note  !== undefined ? note  : existing.notes,
        terms: terms !== undefined ? terms : existing.terms,
        items: {
          create: items.map((item, index) => ({
            productId:   item.productId   || null,
            name:        item.name,
            description: item.description || null,
            hsnCode:     item.hsn         || null,
            quantity:    parseFloat(item.qty)    || 0,
            unitRate:    parseFloat(item.rate)   || 0,
            amount:      parseFloat(item.amount) || 0,
            sortOrder:   index,
          })),
        },
      },
      include: { supplier: true, items: { orderBy: { sortOrder: 'asc' } } },
    })

    res.json(purchase)
  } catch (err) {
    console.error('updatePurchase:', err)
    res.status(500).json({ error: 'Failed to update purchase' })
  }
}

// ── PATCH /api/purchases/:id/status ──────────────────────────────────────────
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['DRAFT', 'PENDING', 'PAID', 'CANCELLED']

    if (!valid.includes(status?.toUpperCase())) {
      return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` })
    }

    const purchase = await prisma.purchase.update({
      where: { id: req.params.id },
      data:  { status: status.toUpperCase() },
    })

    res.json(purchase)
  } catch (err) {
    console.error('updateStatus:', err)
    res.status(500).json({ error: 'Failed to update status' })
  }
}

// ── PATCH /api/purchases/:id/mode ─────────────────────────────────────────────
export const updateMode = async (req, res) => {
  try {
    const { paymentMode } = req.body
    const valid      = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER']
    const normalized = paymentMode?.toUpperCase().replace(' ', '_')

    if (!valid.includes(normalized)) {
      return res.status(400).json({ error: `Mode must be one of: ${valid.join(', ')}` })
    }

    const purchase = await prisma.purchase.update({
      where: { id: req.params.id },
      data:  { payment_mode: normalized },
    })

    res.json(purchase)
  } catch (err) {
    console.error('updateMode:', err)
    res.status(500).json({ error: 'Failed to update payment mode' })
  }
}

// ── DELETE /api/purchases/:id ─────────────────────────────────────────────────
export const deletePurchase = async (req, res) => {
  try {
    const existing = await prisma.purchase.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Purchase not found' })

    await prisma.purchase.delete({ where: { id: req.params.id } })
    res.json({ message: 'Purchase deleted successfully' })
  } catch (err) {
    console.error('deletePurchase:', err)
    res.status(500).json({ error: 'Failed to delete purchase' })
  }
}