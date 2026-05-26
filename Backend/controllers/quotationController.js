import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Schema pulled by Prisma uses snake_case field names:
//   prisma.quotations        (model quotations)
//   prisma.quotation_items   (model quotation_items)
//   business.quotation_count / business.quotation_prefix  (no @map on Business)

const generateQuotationNumber = async (businessId) => {
  const business = await prisma.business.update({
    where: { id: businessId },
    data: { quotation_count: { increment: 1 } },
    select: { quotation_count: true, quotation_prefix: true },
  })
  const year = new Date().getFullYear()
  const seq  = String(business.quotation_count).padStart(4, '0')
  const prefix = business.quotation_prefix ?? 'QUO'
  return `${prefix}-${year}-${seq}`
}

const calcTotals = (items, gstRate = 9) => {
  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.quantity) * Number(it.unitRate), 0
  )
  const cgst = parseFloat(((subtotal * gstRate) / 100).toFixed(2))
  const sgst = parseFloat(((subtotal * gstRate) / 100).toFixed(2))
  const totalAmount = parseFloat((subtotal + cgst + sgst).toFixed(2))
  return { subtotal: parseFloat(subtotal.toFixed(2)), cgst, sgst, totalAmount }
}

// Items shape helper — maps camelCase from req.body to snake_case DB columns
const mapItems = (items, idx) => items.map((it, i) => ({
  product_id:  it.productId  || null,
  name:        it.name,
  description: it.description || null,
  hsn_code:    it.hsnCode    || null,
  quantity:    Number(it.quantity),
  unit_rate:   Number(it.unitRate),
  amount:      parseFloat((Number(it.quantity) * Number(it.unitRate)).toFixed(2)),
  sort_order:  i,
}))

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createQuotation = async (req, res) => {
  try {
    const {
      customerId,
      issueDate,
      validUntil,
      items = [],
      notes,
      terms,
      paidAmount = 0,
      paymentMode = 'CASH',
      gstRate,
    } = req.body

    const businessId  = req.user.businessId
    const createdById = req.user.id

    if (!items.length)
      return res.status(400).json({ message: 'At least one item is required' })

    const quotation_number = await generateQuotationNumber(businessId)
    const { subtotal, cgst, sgst, totalAmount } = calcTotals(items, gstRate)

    const quotation = await prisma.quotations.create({
      data: {
        business_id:      businessId,
        customer_id:      customerId || null,
        created_by_id:    createdById,
        quotation_number,
        issue_date:       issueDate ? new Date(issueDate) : new Date(),
        valid_until:      validUntil ? new Date(validUntil) : null,
        subtotal,
        cgst,
        sgst,
        total_amount:     totalAmount,
        paid_amount:      parseFloat(Number(paidAmount).toFixed(2)),
        payment_mode:     paymentMode,
        notes:            notes || null,
        terms:            terms || null,
        status:           'DRAFT',
        quotation_items:  { create: mapItems(items) },
      },
      include: {
        quotation_items: { orderBy: { sort_order: 'asc' } },
        customers:       { select: { id: true, name: true, email: true, phone: true } },
        users:           { select: { id: true, fullName: true } },
      },
    })

    res.status(201).json(quotation)
  } catch (err) {
    console.error('createQuotation:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}

// ─── LIST ─────────────────────────────────────────────────────────────────────

export const getQuotations = async (req, res) => {
  try {
    const businessId = req.user.businessId
    const {
      status, customerId, search, year, month,
      page = '1', limit = '10',
    } = req.query

    const where = { business_id: businessId }

    if (status && status !== 'All')
      where.status = status.toUpperCase()

    if (customerId)
      where.customer_id = customerId

    if (search) {
      where.OR = [
        { quotation_number: { contains: search, mode: 'insensitive' } },
        { customers: { name: { contains: search, mode: 'insensitive' } } },
        { notes:     { contains: search, mode: 'insensitive' } },
      ]
    }

    if (year) {
      const y = parseInt(year)
      where.issue_date = {
        gte: new Date(y, month ? parseInt(month) - 1 : 0, 1),
        lt:  month
          ? new Date(y, parseInt(month), 1)
          : new Date(y + 1, 0, 1),
      }
    }

    const pageNum = Math.max(1, parseInt(page))
    const take    = Math.min(100, Math.max(1, parseInt(limit)))
    const skip    = (pageNum - 1) * take

    const [quotations, total] = await Promise.all([
      prisma.quotations.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          customers: { select: { id: true, name: true, email: true } },
          users:     { select: { id: true, fullName: true } },
          _count:    { select: { quotation_items: true } },
        },
      }),
      prisma.quotations.count({ where }),
    ])

    res.json({
      data: quotations,
      meta: {
        total,
        page:       pageNum,
        limit:      take,
        totalPages: Math.ceil(total / take),
      },
    })
  } catch (err) {
    console.error('getQuotations:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}

// ─── GET ONE ──────────────────────────────────────────────────────────────────

export const getQuotationById = async (req, res) => {
  try {
    const { id }      = req.params
    const businessId  = req.user.businessId

    const quotation = await prisma.quotations.findFirst({
      where: { id, business_id: businessId },
      include: {
        quotation_items: { orderBy: { sort_order: 'asc' } },
        customers:       true,
        users:           { select: { id: true, fullName: true, email: true } },
      },
    })

    if (!quotation)
      return res.status(404).json({ message: 'Quotation not found' })

    res.json(quotation)
  } catch (err) {
    console.error('getQuotationById:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateQuotation = async (req, res) => {
  try {
    const { id }     = req.params
    const businessId = req.user.businessId

    const existing = await prisma.quotations.findFirst({
      where: { id, business_id: businessId },
    })
    if (!existing)
      return res.status(404).json({ message: 'Quotation not found' })

    if (['CLOSED', 'CANCELLED'].includes(existing.status))
      return res.status(400).json({
        message: `Cannot edit a ${existing.status.toLowerCase()} quotation`,
      })

    const { customerId, issueDate, validUntil, items, notes, terms, paidAmount, paymentMode, gstRate } = req.body

    const data = {}
    if (customerId  !== undefined) data.customer_id  = customerId || null
    if (issueDate)                 data.issue_date   = new Date(issueDate)
    if (validUntil)                data.valid_until  = new Date(validUntil)
    if (notes       !== undefined) data.notes        = notes
    if (terms       !== undefined) data.terms        = terms
    if (paidAmount  !== undefined) data.paid_amount  = parseFloat(Number(paidAmount).toFixed(2))
    if (paymentMode)               data.payment_mode = paymentMode

    if (items && items.length) {
      const { subtotal, cgst, sgst, totalAmount } = calcTotals(items, gstRate)
      Object.assign(data, { subtotal, cgst, sgst, total_amount: totalAmount })

      await prisma.quotation_items.deleteMany({ where: { quotation_id: id } })
      data.quotation_items = { create: mapItems(items) }
    }

    const updated = await prisma.quotations.update({
      where: { id },
      data,
      include: {
        quotation_items: { orderBy: { sort_order: 'asc' } },
        customers:       { select: { id: true, name: true, email: true, phone: true } },
        users:           { select: { id: true, fullName: true } },
      },
    })

    res.json(updated)
  } catch (err) {
    console.error('updateQuotation:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}

// ─── STATUS ONLY ──────────────────────────────────────────────────────────────

export const updateQuotationStatus = async (req, res) => {
  try {
    const { id }     = req.params
    const { status } = req.body
    const businessId = req.user.businessId

    const valid = ['DRAFT', 'OPEN', 'CLOSED', 'PARTIAL', 'PENDING', 'CANCELLED']
    if (!valid.includes(status))
      return res.status(400).json({ message: 'Invalid status value' })

    const existing = await prisma.quotations.findFirst({
      where: { id, business_id: businessId },
    })
    if (!existing)
      return res.status(404).json({ message: 'Quotation not found' })

    const updated = await prisma.quotations.update({
      where: { id },
      data:  { status },
      select: { id: true, status: true, updated_at: true },
    })

    res.json(updated)
  } catch (err) {
    console.error('updateQuotationStatus:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteQuotation = async (req, res) => {
  try {
    const { id }     = req.params
    const businessId = req.user.businessId

    const existing = await prisma.quotations.findFirst({
      where: { id, business_id: businessId },
    })
    if (!existing)
      return res.status(404).json({ message: 'Quotation not found' })

    await prisma.quotations.delete({ where: { id } })

    res.json({ message: 'Quotation deleted successfully' })
  } catch (err) {
    console.error('deleteQuotation:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}

// ─── CONVERT TO INVOICE ───────────────────────────────────────────────────────

export const convertToInvoice = async (req, res) => {
  try {
    const { id }      = req.params
    const businessId  = req.user.businessId
    const createdById = req.user.id

    const quotation = await prisma.quotations.findFirst({
      where:   { id, business_id: businessId },
      include: { quotation_items: { orderBy: { sort_order: 'asc' } } },
    })

    if (!quotation)
      return res.status(404).json({ message: 'Quotation not found' })
    if (!quotation.customer_id)
      return res.status(400).json({ message: 'Assign a customer before converting to invoice' })
    if (quotation.status === 'CLOSED')
      return res.status(400).json({ message: 'Quotation already converted' })

    const business = await prisma.business.update({
      where:  { id: businessId },
      data:   { invoiceCount: { increment: 1 } },
      select: { invoiceCount: true, invoicePrefix: true },
    })
    const invoiceNumber = `${business.invoicePrefix ?? 'INV'}-${new Date().getFullYear()}-${String(business.invoiceCount).padStart(4, '0')}`

    const taxAmount = parseFloat(
      (Number(quotation.cgst) + Number(quotation.sgst)).toFixed(2)
    )

    const [invoice] = await prisma.$transaction([
      prisma.invoice.create({
        data: {
          businessId,
          customerId:     quotation.customer_id,
          createdById,
          invoiceNumber,
          status:         'DRAFT',
          issueDate:      new Date(),
          dueDate:        quotation.valid_until ?? null,
          subtotal:       quotation.subtotal,
          taxAmount,
          discountAmount: 0,
          totalAmount:    quotation.total_amount,
          paidAmount:     0,
          balanceDue:     quotation.total_amount,
          notes:          quotation.notes,
          terms:          quotation.terms,
          items: {
            create: quotation.quotation_items.map((it, idx) => ({
              productId:   it.product_id  || null,
              name:        it.name,
              description: it.description || null,
              quantity:    it.quantity,
              unit:        'PCS',
              unitPrice:   it.unit_rate,
              taxPercent:  18,
              taxAmount:   parseFloat((Number(it.amount) * 0.18).toFixed(2)),
              totalAmount: parseFloat((Number(it.amount) * 1.18).toFixed(2)),
              sortOrder:   idx,
            })),
          },
        },
        include: { items: true },
      }),
      prisma.quotations.update({
        where: { id },
        data:  { status: 'CLOSED' },
      }),
    ])

    res.status(201).json({ message: 'Quotation converted to invoice', invoice })
  } catch (err) {
    console.error('convertToInvoice:', err)
    res.status(500).json({ message: err.message ?? 'Internal server error' })
  }
}