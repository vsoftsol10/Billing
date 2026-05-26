// src/api/customerService.js
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, '')
const BASE = `${BASE_URL}/api/customers`

const authHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const handleResponse = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || res.statusText || 'Request failed')
  }
  return res.json()
}

/**
 * GET /api/customers
 * Returns: Customer[]
 */
export const listCustomers = async () => {
  const response = await handleResponse(
    await fetch(BASE, { headers: authHeaders() })
  )
  // Handle both direct array and wrapped { customers: [...] } responses
  return Array.isArray(response) ? response : (response.customers || response.data || [])
}

/**
 * POST /api/customers
 * Creates a new customer
 */
export const createCustomer = async (payload) => {
  return handleResponse(
    await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
  )
}

/**
 * GET /api/customers/:id
 * Returns a single customer
 */
export const getCustomer = async (id) => {
  return handleResponse(
    await fetch(`${BASE}/${id}`, { headers: authHeaders() })
  )
}
