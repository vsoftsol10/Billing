// services/ewayBillService.js
// Centralised API calls for the E-Way Bill feature.
// All functions read the Bearer token from localStorage and talk to VITE_API_URL.

// Strip any trailing /api from the env var — paths below already include it.
// e.g. if VITE_API_URL = "http://localhost:3000/api"  →  base = "http://localhost:3000"
const _raw = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_BASE = _raw.replace(/\/api\/?$/, '')

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers ?? {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}

// ── Connection ────────────────────────────────────────────────────────────────

/**
 * Connect the business to the GSP portal.
 * @param {{ gspUsername: string, gspPassword: string }} credentials
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export async function connectGSP({ gspUsername, gspPassword }) {
  return apiFetch('/api/ewaybill/connect', {
    method: 'POST',
    body: JSON.stringify({ gspUsername, gspPassword }),
  })
}

/**
 * Get the current GSP connection status for the logged-in business.
 * @returns {Promise<{ success: boolean, connected: boolean, data: object|null }>}
 */
export async function getConnectionStatus() {
  return apiFetch('/api/ewaybill/status')
}

/**
 * Disconnect / soft-delete the GSP credentials.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function disconnectGSP() {
  return apiFetch('/api/ewaybill/disconnect', { method: 'DELETE' })
}

// ── E-Way Bills ───────────────────────────────────────────────────────────────

/**
 * Fetch all e-way bills for the logged-in business.
 *
 * Your backend should expose GET /api/ewaybill  (add this route when ready).
 * Until then this returns an empty array so the table renders cleanly.
 *
 * Expected response shape:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 'EWB-001',
 *       client: 'Globe Inc',
 *       amount: '₹ 8,750',
 *       date: '2026-01-14',
 *       status: 'Pending' | 'Success' | 'Failed' | 'Cancelled',
 *       ewbNo: '123456789012',
 *       docNo: 'INV-001',
 *     },
 *     ...
 *   ]
 * }
 *
 * @returns {Promise<Array>}
 */
export async function fetchEWayBills() {
  try {
    const res = await apiFetch('/api/ewaybill')
    return res.data ?? []
  } catch (err) {
    // Silently return empty if the list route isn't wired yet
    console.warn('fetchEWayBills failed, returning empty:', err.message)
    return []
  }
}

/**
 * Generate a new e-way bill.
 * Pass the full payload expected by POST /api/ewaybill/generate.
 * @param {object} payload
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function generateEWayBill(payload) {
  return apiFetch('/api/ewaybill/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}