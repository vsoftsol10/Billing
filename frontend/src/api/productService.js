// src/services/productService.js
// All API calls for the Product & Service module

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API      = `${BASE_URL}/products`;

const headers = { "Content-Type": "application/json" };

// ── Fetch all products (with optional filters) ────────────────────────────────
export const fetchProducts = async ({ businessId, search, page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams({ businessId, page, limit });
  if (search) params.append("search", search);

  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json(); // { success, data }
};

// ── Fetch product stats ───────────────────────────────────────────────────────
export const fetchProductStats = async (businessId) => {
  const res = await fetch(`${API}/stats?businessId=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch product stats");
  return res.json(); // { success, data: { total, lowStock, outOfStock } }
};

// ── Fetch single product ──────────────────────────────────────────────────────
export const fetchProductById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  console.log("fetchProductById response:", data);
  return data;
};

// ── Create product ────────────────────────────────────────────────────────────
export const createProduct = async (payload) => {
  const res = await fetch(API, {
    method:  "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

// ── Update full product ───────────────────────────────────────────────────────
export const updateProduct = async (id, payload) => {
  const res = await fetch(`${API}/${id}`, {
    method:  "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

// ── Soft delete product ───────────────────────────────────────────────────────
export const deleteProduct = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};