// services/inventoryService.js
// Drop-in fetch wrapper for all inventory API calls.
// Import these in your React components / InventoryPage.

const BASE = "/api/inventory";

// Reads the token you store after login (adjust key name if different)
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

// ─────────────────────────────────────────────────────────────
// Inventory list  →  InventoryTable
// params: { search, status, page, limit }
// ─────────────────────────────────────────────────────────────
export async function fetchInventory(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
  ).toString();
  return handleResponse(
    await fetch(`${BASE}${qs ? `?${qs}` : ""}`, { headers: authHeader() })
  );
}

// ─────────────────────────────────────────────────────────────
// Stats  →  InventoryStats cards
// ─────────────────────────────────────────────────────────────
export async function fetchInventoryStats() {
  return handleResponse(await fetch(`${BASE}/stats`, { headers: authHeader() }));
}

// ─────────────────────────────────────────────────────────────
// Single product
// ─────────────────────────────────────────────────────────────
export async function fetchProduct(id) {
  return handleResponse(await fetch(`${BASE}/${id}`, { headers: authHeader() }));
}

// ─────────────────────────────────────────────────────────────
// Create product  →  StockModal "Add Quantity"
// body: { name, categoryId, unit, sellingPrice, costPrice,
//         stockQuantity, sku, hsnCode, description }
// ─────────────────────────────────────────────────────────────
export async function createProduct(body) {
  return handleResponse(
    await fetch(BASE, {
      method:  "POST",
      headers: authHeader(),
      body:    JSON.stringify(body),
    })
  );
}

// ─────────────────────────────────────────────────────────────
// Update product
// ─────────────────────────────────────────────────────────────
export async function updateProduct(id, body) {
  return handleResponse(
    await fetch(`${BASE}/${id}`, {
      method:  "PATCH",
      headers: authHeader(),
      body:    JSON.stringify(body),
    })
  );
}

// ─────────────────────────────────────────────────────────────
// Delete product (soft)
// ─────────────────────────────────────────────────────────────
export async function deleteProduct(id) {
  return handleResponse(
    await fetch(`${BASE}/${id}`, { method: "DELETE", headers: authHeader() })
  );
}

// ─────────────────────────────────────────────────────────────
// Stock In  →  "Stock In" button in InventoryTable
// body: { quantity, reference?, notes? }
// ─────────────────────────────────────────────────────────────
export async function stockIn(id, body) {
  return handleResponse(
    await fetch(`${BASE}/${id}/stock-in`, {
      method:  "POST",
      headers: authHeader(),
      body:    JSON.stringify(body),
    })
  );
}

// ─────────────────────────────────────────────────────────────
// Stock Out  →  "Stock Out" button in InventoryTable
// body: { quantity, reference?, notes? }
// ─────────────────────────────────────────────────────────────
export async function stockOut(id, body) {
  return handleResponse(
    await fetch(`${BASE}/${id}/stock-out`, {
      method:  "POST",
      headers: authHeader(),
      body:    JSON.stringify(body),
    })
  );
}

// ─────────────────────────────────────────────────────────────
// Stock movement history for one product
// ─────────────────────────────────────────────────────────────
export async function fetchStockMovements(id, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return handleResponse(
    await fetch(`${BASE}/${id}/movements${qs ? `?${qs}` : ""}`, { headers: authHeader() })
  );
}

// ─────────────────────────────────────────────────────────────
// Categories  →  StockModal dropdown
// ─────────────────────────────────────────────────────────────
export async function fetchCategories() {
  return handleResponse(await fetch(`${BASE}/categories`, { headers: authHeader() }));
}

export async function createCategory(body) {
  return handleResponse(
    await fetch(`${BASE}/categories`, {
      method:  "POST",
      headers: authHeader(),
      body:    JSON.stringify(body),
    })
  );
}