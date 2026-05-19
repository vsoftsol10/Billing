// src/services/purchaseService.js
// All API calls for the Purchase module

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API      = `${BASE_URL}/purchases`;

const headers = { "Content-Type": "application/json" };

// ── Fetch all purchases (with optional filters) ───────────────────────────────
export const fetchPurchases = async ({ businessId, status, search, page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams({ businessId, page, limit });
  if (status && status !== "All") params.append("status", status);
  if (search) params.append("search", search);

  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch purchases");
  return res.json(); // { data, meta }
};

// ── Fetch single purchase ─────────────────────────────────────────────────────
export const fetchPurchaseById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch purchase");
  const data = await res.json();
  console.log('fetchPurchaseById response:', data); // ← add this
  return data;
};

// ── Create purchase ───────────────────────────────────────────────────────────
// payload shape matches CreatePurchase.jsx onSave(payload())
export const createPurchase = async (payload) => {
  const res = await fetch(API, {
    method:  "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create purchase");
  return res.json();
};

// ── Save draft ────────────────────────────────────────────────────────────────
export const savePurchaseDraft = async (payload) => {
  const res = await fetch(`${API}/draft`, {
    method:  "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save draft");
  return res.json();
};

// ── Update full purchase ──────────────────────────────────────────────────────
export const updatePurchase = async (id, payload) => {
  const res = await fetch(`${API}/${id}`, {
    method:  "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update purchase");
  return res.json();
};

// ── Update status (PurchaseTable status dropdown) ─────────────────────────────
export const updatePurchaseStatus = async (id, status) => {
  const res = await fetch(`${API}/${id}/status`, {
    method:  "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

// ── Update payment mode (PurchaseTable mode dropdown) ─────────────────────────
export const updatePurchaseMode = async (id, paymentMode) => {
  const res = await fetch(`${API}/${id}/mode`, {
    method:  "PATCH",
    headers,
    body: JSON.stringify({ paymentMode }),
  });
  if (!res.ok) throw new Error("Failed to update payment mode");
  return res.json();
};

// ── Delete purchase ───────────────────────────────────────────────────────────
export const deletePurchase = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete purchase");
  return res.json();
};