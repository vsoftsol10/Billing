// components/ProductService/AddNewClientModal.jsx
import { useState } from "react";

const CATEGORIES = ["Electronics", "Furniture", "Stationery", "Raw Material", "Finished Goods"];
const UNITS = ["No", "Pcs", "Kg", "Ltr", "Mtr", "Box", "Set"];

const EMPTY = {
  name: "", gstNo: "", sellingPrice: "",
  category: "", units: "No", hsnSac: "",
  purchasePrice: "", barcode: "", discount: "",
  lowStockAlert: "", maxDiscount: "", description: "",
  showInOnlineStore: true, notInSale: false,
};

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500
        after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white
        after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
    </label>
  );
}

export default function AddNewClientModal({ onClose, onAdd }) {
  const [tab, setTab]       = useState("Product");
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name        = "This field is required";
    if (!form.sellingPrice.trim()) e.sellingPrice = "This field is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: Date.now(),
      name: form.name,
      qty: 0,
      mrp: parseFloat(form.sellingPrice) || 0,
      sellingPrice: `₹ ${form.sellingPrice}`,
      taxableAmount: "—",
      costPrice: parseFloat(form.purchasePrice) || 0,
    });
    onClose();
  };

  const inputCls = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
    ${errors[key]
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-gray-200 focus:border-amber-400 bg-white"}`;

  const isProduct = tab === "Product";

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Side panel ── */}
      <div
        className="bg-white w-96 h-full flex flex-col shadow-2xl"
        style={{ animation: "slideIn 0.22s ease" }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(40px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Fixed header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Fixed tabs */}
        <div className="flex gap-2 px-6 pt-4 shrink-0">
          {["Product", "Service"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setForm(EMPTY); setErrors({}); }}
              className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all
                ${tab === t
                  ? "bg-amber-400 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-amber-300 hover:text-gray-700"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {isProduct ? "Product Name" : "Service Name"}
            </label>
            <input
              type="text"
              placeholder="Enter Product name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* GST No + Selling Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">GST No</label>
              <input
                type="text" placeholder="Enter product name"
                value={form.gstNo} onChange={(e) => set("gstNo", e.target.value)}
                className={inputCls("gstNo")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text" placeholder="0.00"
                value={form.sellingPrice} onChange={(e) => set("sellingPrice", e.target.value)}
                className={inputCls("sellingPrice")}
              />
              {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
            </div>
          </div>

          {/* Category + Units */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             outline-none focus:border-amber-400 bg-white appearance-none pr-8"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Units</label>
              <div className="relative">
                <select
                  value={form.units}
                  onChange={(e) => set("units", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             outline-none focus:border-amber-400 bg-white appearance-none pr-8"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="pt-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Additional Information
            </p>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">HSN/SAC</label>
              <input type="text" value={form.hsnSac}
                onChange={(e) => set("hsnSac", e.target.value)}
                className={inputCls("hsnSac")} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Purchase Price</label>
                <input type="text" value={form.purchasePrice}
                  onChange={(e) => set("purchasePrice", e.target.value)}
                  className={inputCls("purchasePrice")} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bar code</label>
                <input type="text" value={form.barcode}
                  onChange={(e) => set("barcode", e.target.value)}
                  className={inputCls("barcode")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Discount</label>
                <input type="text" value={form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                  className={inputCls("discount")} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Low Stock Alert</label>
                <input type="text" value={form.lowStockAlert}
                  onChange={(e) => set("lowStockAlert", e.target.value)}
                  className={inputCls("lowStockAlert")} />
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Max Discount</label>
              <input type="text" value={form.maxDiscount}
                onChange={(e) => set("maxDiscount", e.target.value)}
                className={inputCls("maxDiscount")} />
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Upgrade to control per-product discount limits. Manage this from company settings.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={4} value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         outline-none focus:border-amber-400 bg-white resize-none"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="inline-flex flex-col items-center justify-center w-20 h-20 border-2
                               border-dashed border-gray-300 rounded-xl cursor-pointer
                               hover:border-amber-400 transition-colors text-gray-400 hover:text-amber-500">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 16V8M12 8l-3 3M12 8l3 3"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
              <span className="text-xs mt-1 font-medium">Upload</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          {/* Sales */}
          <div className="pt-1">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Sales</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">Show in Online Store</span>
              <Toggle checked={form.showInOnlineStore}
                onChange={(e) => set("showInOnlineStore", e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Not in Sale</span>
              <Toggle checked={form.notInSale}
                onChange={(e) => set("notInSale", e.target.checked)} />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl text-sm font-bold bg-amber-400
                       hover:bg-amber-500 text-gray-900 active:scale-95 transition-all shadow-sm"
          >
            {isProduct ? "Save Product" : "Save Service"}
          </button>

        </div>
      </div>
    </div>
  );
}