// src/services/api.js
// Drop this file in your React project at src/services/api.js
// Then import the functions you need in each component.

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// Reads the JWT token set by your auth flow (login stores it)
const getToken = () => localStorage.getItem('token') ?? ''

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

const handle = async (res) => {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
  return data
}

// ─────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────

/**
 * Used by InvoiceTable to load rows.
 * Pass filters from InvoiceFilters + FYFilter + search box.
 *
 * @example
 * fetchInvoices({ status: 'Pending', fyStart: '2025-04-01', fyEnd: '2026-03-31', page: 1 })
 */
export const fetchInvoices = ({ search, status, fyStart, fyEnd, page, limit } = {}) => {
  const params = new URLSearchParams()
  if (search)  params.set('search',  search)
  if (status && status !== 'All') params.set('status', status)
  if (fyStart) params.set('fyStart', fyStart)
  if (fyEnd)   params.set('fyEnd',   fyEnd)
  if (page)    params.set('page',    page)
  if (limit)   params.set('limit',   limit)
  const qs = params.toString()
  return fetch(`${BASE}/invoices${qs ? `?${qs}` : ''}`, { headers: headers() }).then(handle)
}

/**
 * Used by InvoiceStats component.
 * Returns { total, pending, paid, overdue, draft, cancelled }
 */
export const fetchInvoiceStats = () =>
  fetch(`${BASE}/invoices/stats`, { headers: headers() }).then(handle)

/** Fetch a single invoice by DB uuid */
export const fetchInvoice = (id) =>
  fetch(`${BASE}/invoices/${id}`, { headers: headers() }).then(handle)

/**
 * Create invoice — called from CreateInvoice component onSave.
 *
 * @param {{
 *   customerId: string,
 *   date: string,
 *   dueDate: string,
 *   items: { name, description, hsn, qty, rate, taxPercent? }[],
 *   note: string,
 *   terms: string,
 *   paymentAmount: number,
 *   paymentMode: 'UPI'|'Cash'|'Bank Transfer'|'Cheque'|'Card',
 *   gstRate: number
 * }} data
 */
export const createInvoice = (data) =>
  fetch(`${BASE}/invoices`, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify(data),
  }).then(handle)

/** Full update for an invoice (edit flow) */
export const updateInvoice = (id, data) =>
  fetch(`${BASE}/invoices/${id}`, {
    method:  'PUT',
    headers: headers(),
    body:    JSON.stringify(data),
  }).then(handle)

/**
 * Status-only patch — wired to StatusDropdown onChange in InvoiceTable.
 * status: 'Paid' | 'Pending' | 'Open' | 'Draft' | 'Cancelled'
 */
export const updateInvoiceStatus = (dbId, status) =>
  fetch(`${BASE}/invoices/${dbId}/status`, {
    method:  'PATCH',
    headers: headers(),
    body:    JSON.stringify({ status }),
  }).then(handle)

/**
 * Soft-cancel — wired to ActionDropdown Delete.
 * Uses dbId (the UUID), not the display invoiceNumber.
 */
export const deleteInvoice = (dbId) =>
  fetch(`${BASE}/invoices/${dbId}`, {
    method:  'DELETE',
    headers: headers(),
  }).then(handle)

// ─────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────

export const fetchPayments = (invoiceDbId) =>
  fetch(`${BASE}/invoices/${invoiceDbId}/payments`, { headers: headers() }).then(handle)

export const recordPayment = (invoiceDbId, data) =>
  fetch(`${BASE}/invoices/${invoiceDbId}/payments`, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify(data),
  }).then(handle)

// ─────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────

/**
 * Search customers — used in CreateInvoice customer search box.
 * @example fetchCustomers({ search: 'Acme', limit: 10 })
 */
export const fetchCustomers = ({ search, page, limit, isActive } = {}) => {
  const params = new URLSearchParams()
  if (search   !== undefined) params.set('search',   search)
  if (page     !== undefined) params.set('page',     page)
  if (limit    !== undefined) params.set('limit',    limit)
  if (isActive !== undefined) params.set('isActive', isActive)
  const qs = params.toString()
  return fetch(`${BASE}/customers${qs ? `?${qs}` : ''}`, { headers: headers() }).then(handle)
}

/**
 * Create customer — called from AddNewClientModal handleSave.
 * Accepts the exact form fields from the modal (customerName, gstNo, etc.)
 * The controller normalises them automatically.
 */
export const createCustomer = (formData) =>
  fetch(`${BASE}/customers`, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify(formData),
  }).then(handle)

export const updateCustomer = (id, data) =>
  fetch(`${BASE}/customers/${id}`, {
    method:  'PUT',
    headers: headers(),
    body:    JSON.stringify(data),
  }).then(handle)

export const deleteCustomer = (id) =>
  fetch(`${BASE}/customers/${id}`, {
    method:  'DELETE',
    headers: headers(),
  }).then(handle)