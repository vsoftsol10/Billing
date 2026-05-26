// src/services/quotationService.js
// Connects the Quotation frontend to /api/quotations backend routes.
// Follows the same pattern you'd use for invoiceService / purchaseService.

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, '')
const BASE = `${BASE_URL}/api/quotations`

// ─── Auth header helper ────────────────────────────────────────────────────────
// Reads the JWT token that your authRoute stores in localStorage after login.
const authHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ─── Error normaliser ──────────────────────────────────────────────────────────
// Extracts the message string from the server's { message: '...' } shape,
// or falls back to the HTTP status text.
const handleResponse = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || res.statusText || 'Request failed')
  }
  return res.json()
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * GET /api/quotations
 * Supported filters (all optional):
 *   status      – 'DRAFT' | 'OPEN' | 'CLOSED' | 'PARTIAL' | 'PENDING' | 'CANCELLED'
 *   search      – string (quotation number or customer name)
 *   year        – '2026'
 *   month       – '05'  (only used when year is also set)
 *   page        – number (default 1)
 *   limit       – number (default 10)
 *
 * Returns: { data: Quotation[], meta: { total, page, limit, totalPages } }
 */
export const getQuotations = async (filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, v)
  })
  const url = params.size ? `${BASE}?${params}` : BASE
  return handleResponse(await fetch(url, { headers: authHeaders() }))
}

/**
 * GET /api/quotations/:id
 * Returns a single quotation with its items and customer.
 */
export const getQuotationById = async (id) => {
  return handleResponse(
    await fetch(`${BASE}/${id}`, { headers: authHeaders() })
  )
}

/**
 * POST /api/quotations
 * Body shape mirrors the CreateQuotation form:
 * {
 *   customerId?,
 *   issueDate,
 *   validUntil?,
 *   items: [{ name, description?, hsnCode?, quantity, unitRate, productId? }],
 *   notes?,
 *   terms?,
 *   paidAmount?,
 *   paymentMode?,   // 'UPI' | 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD'
 *   gstRate?        // default 9 (9% CGST + 9% SGST)
 * }
 */
export const createQuotation = async (payload) => {
  return handleResponse(
    await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
  )
}

/**
 * PUT /api/quotations/:id
 * Same body shape as createQuotation — all fields optional.
 * If `items` is supplied the entire item list is replaced and totals recalculated.
 */
export const updateQuotation = async (id, payload) => {
  return handleResponse(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
  )
}

/**
 * PATCH /api/quotations/:id/status
 * Lightweight status-only update — used by the table StatusDropdown.
 * status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'PARTIAL' | 'PENDING' | 'CANCELLED'
 */
export const updateQuotationStatus = async (id, status) => {
  return handleResponse(
    await fetch(`${BASE}/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    })
  )
}

/**
 * DELETE /api/quotations/:id
 * Returns: { message: 'Quotation deleted successfully' }
 */
export const deleteQuotation = async (id) => {
  return handleResponse(
    await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  )
}

/**
 * POST /api/quotations/:id/convert
 * Converts a quotation to a draft Invoice (server runs this in a transaction).
 * Marks the quotation as CLOSED.
 * Returns: { message, invoice }
 */
export const convertQuotationToInvoice = async (id) => {
  return handleResponse(
    await fetch(`${BASE}/${id}/convert`, {
      method: 'POST',
      headers: authHeaders(),
    })
  )
}