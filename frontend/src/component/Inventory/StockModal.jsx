// StockModal.jsx
import { useState } from "react";

const CATEGORIES = ["Electronics", "Furniture", "Stationery", "Raw Material", "Finished Goods"];

export default function StockModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    quantityValue: "", quantityUnit: "PCS",
    purchase: "", category: "",
    stockValue: "", remark: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.quantityValue.trim()) e.quantityValue = "Quantity is required";
    if (!form.purchase.trim())      e.purchase      = "Purchase is required";
    if (!form.category)             e.category      = "Category is required";
    if (!form.stockValue.trim())    e.stockValue    = "Stock value is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: Date.now(),
      name: form.remark || "New Item",
      qty: form.quantityValue,
      salesPrice: `₹ ${form.stockValue}`,
      purchasePrice: `₹ ${form.purchase}`,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    });
    onClose();
  };

  const inputClass = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
    ${errors[key]
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-gray-200 focus:border-yellow-400 bg-white"}`;

  const selectClass = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors appearance-none bg-white
    ${errors[key] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-yellow-400"}`;

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-80 min-h-screen p-6 shadow-2xl overflow-y-auto"
           style={{ animation: "slideIn 0.22s ease" }}>
        <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-900">Add Quantity</h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="space-y-5">

          {/* Quantity Information */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
              Quantity Information
            </p>

            {/* Quantity row: value + unit */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Quantity <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Select Category"
                  value={form.quantityValue}
                  onChange={(e) => set("quantityValue", e.target.value)}
                  className={inputClass("quantityValue")}
                />
                {errors.quantityValue && <p className="text-red-500 text-xs mt-1">{errors.quantityValue}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Quantity <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.quantityUnit}
                  onChange={(e) => set("quantityUnit", e.target.value)}
                  className={selectClass("quantityUnit")}
                >
                  {["PCS", "KG", "LTR", "MTR", "BOX"].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Purchase */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Purchase</label>
              <input
                type="text"
                placeholder="Enter purchase price"
                value={form.purchase}
                onChange={(e) => set("purchase", e.target.value)}
                className={inputClass("purchase")}
              />
              {errors.purchase && <p className="text-red-500 text-xs mt-1">{errors.purchase}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={selectClass("category")}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Stock Details */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
              Stock Details
            </p>

            {/* Stock Value */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock Value</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter stock value"
                  value={form.stockValue}
                  onChange={(e) => set("stockValue", e.target.value)}
                  className={`${inputClass("stockValue")} pr-8`}
                />
                {/* up/down arrows like the screenshot */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 5L5 1L9 5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {errors.stockValue && <p className="text-red-500 text-xs mt-1">{errors.stockValue}</p>}
            </div>

            {/* Remark */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Remark</label>
              <textarea
                placeholder="Optional remark..."
                value={form.remark}
                onChange={(e) => set("remark", e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                           outline-none focus:border-yellow-400 bg-white resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl text-sm font-bold bg-yellow-400
                       hover:bg-yellow-500 text-gray-900 active:scale-95 transition-all
                       flex items-center justify-center gap-2 shadow-sm"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Quantity
          </button>

        </div>
      </div>
    </div>
  );
}