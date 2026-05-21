import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── GET /api/customers ───────────────────────────────────────────────────────
// Query: search, page, limit, isActive
export const listCustomers = async (req, res) => {
  try {
    const businessId = req.user.businessId
    if (!businessId) return res.status(403).json({ message: 'No business linked to this account.' })

    const { search = '', page = 1, limit = 20, isActive } = req.query

    const where = {
      businessId,
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && {
        OR: [
          { name:  { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { gstin: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip:    (Number(page) - 1) * Number(limit),
        take:    Number(limit),
      }),
      prisma.customer.count({ where }),
    ])

    res.json({ customers, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    console.error('[LIST CUSTOMERS]', err)
    res.status(500).json({ message: 'Failed to fetch customers.' })
  }
}

// ─── GET /api/customers/:id ───────────────────────────────────────────────────
export const getCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take:    10,
          select:  {
            id: true, invoiceNumber: true, status: true,
            totalAmount: true, issueDate: true, dueDate: true,
          },
        },
      },
    })

    if (!customer) return res.status(404).json({ message: 'Customer not found.' })
    res.json(customer)
  } catch (err) {
    console.error('[GET CUSTOMER]', err)
    res.status(500).json({ message: 'Failed to fetch customer.' })
  }
}

// ─── POST /api/customers ──────────────────────────────────────────────────────
// Called from AddNewClientModal — body fields match the modal form
export const createCustomer = async (req, res) => {
  try {
    const businessId = req.user.businessId
    if (!businessId) return res.status(403).json({ message: 'No business linked to this account.' })

    // Accept both modal field names and direct API field names
    const {
      name,         customerName,
      email,        emailAddress,
      phone,        phoneNumber,
      gstin,        gstNo,
      address,      clientAddress,
      city, state, pincode, notes,
      companyName,
    } = req.body

    const resolvedName = (name || customerName)?.trim()
    if (!resolvedName) return res.status(400).json({ message: 'Customer name is required.' })

    const customer = await prisma.customer.create({
      data: {
        businessId,
        name:    resolvedName,
        email:   email   || emailAddress   || null,
        phone:   phone   || phoneNumber    || null,
        gstin:   gstin   || gstNo          || null,
        address: address || clientAddress  || null,
        city:    city    || null,
        state:   state   || null,
        pincode: pincode || null,
        // companyName has no dedicated column — store in notes
        notes:   notes   || (companyName ? `Company: ${companyName}` : null),
      },
    })

    res.status(201).json(customer)
  } catch (err) {
    console.error('[CREATE CUSTOMER]', err)
    res.status(500).json({ message: 'Failed to create customer.' })
  }
}

// ─── PUT /api/customers/:id ───────────────────────────────────────────────────
export const updateCustomer = async (req, res) => {
  try {
    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!existing) return res.status(404).json({ message: 'Customer not found.' })

    const { name, email, phone, gstin, address, city, state, pincode, notes, isActive } = req.body

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        ...(name     !== undefined && { name: name.trim() }),
        ...(email    !== undefined && { email }),
        ...(phone    !== undefined && { phone }),
        ...(gstin    !== undefined && { gstin }),
        ...(address  !== undefined && { address }),
        ...(city     !== undefined && { city }),
        ...(state    !== undefined && { state }),
        ...(pincode  !== undefined && { pincode }),
        ...(notes    !== undefined && { notes }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    res.json(customer)
  } catch (err) {
    console.error('[UPDATE CUSTOMER]', err)
    res.status(500).json({ message: 'Failed to update customer.' })
  }
}

// ─── DELETE /api/customers/:id ────────────────────────────────────────────────
// Soft-delete: marks inactive to preserve invoice history
export const deleteCustomer = async (req, res) => {
  try {
    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    })
    if (!existing) return res.status(404).json({ message: 'Customer not found.' })

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data:  { isActive: false },
    })

    res.json({ message: 'Customer deactivated.', customer })
  } catch (err) {
    console.error('[DELETE CUSTOMER]', err)
    res.status(500).json({ message: 'Failed to delete customer.' })
  }
}