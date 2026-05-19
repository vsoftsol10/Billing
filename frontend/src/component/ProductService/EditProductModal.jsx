import { useState } from "react";
import { updateProduct } from "../../api/productService";

const UNITS = ["PCS", "KG", "G", "L", "ML", "BOX", "DOZEN", "METER", "SQFT", "OTHER"];

export default function EditProductModal({ item, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name:          item.name         ?? "",
    sellingPrice:  item.mrp          ?? "",
    costPrice:     item.costPrice    ?? "",
    lowStockAlert: item.lowStockAlert ?? 10,
    unit:          item.unit         ?? "PCS",
    description:   item.description  ?? "",
    hsnCode:       item.hsnCode      ?? "",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name         = "Required";
    if (!String(form.sellingPrice).trim()) e.sellingPrice = "Required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const res = await updateProduct(item.id, {
        name:          form.name,
        sellingPrice:  parseFloat(form.sellingPrice),
        costPrice:     form.costPrice   ? parseFloat(form.costPrice)   : null,
        lowStockAlert: form.lowStockAlert ? parseInt(form.lowStockAlert) : 10,
        unit:          form.unit,
        description:   form.description || null,
        hsnCode:       form.hsnCode     || null,
      });

      // map updated API data back to table format
      onUpdate({
        ...item,
        name:          res.data.name,
        qty:           res.data.stockQuantity,
        mrp:           parseFloat(res.data.sellingPrice),
        sellingPrice:  `₹ ${parseFloat(res.data.sellingPrice).toLocaleString("en-IN")}`,
        taxableAmount: `${res.data.taxPercent}%`,
        costPrice:     parseFloat(res.data.costPrice ?? 0),
        unit:          res.data.unit,
        description:   res.data.description,
        hsnCode:       res.data.hsnCode,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
    ${errors[key]
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-gray-200 focus:border-amber-400 bg-white"}`;

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
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

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Selling + Cost Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number" value={form.sellingPrice}
                onChange={(e) => set("sellingPrice", e.target.value)}
                className={inputCls("sellingPrice")}
              />
              {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cost Price</label>
              <input
                type="number" value={form.costPrice}
                onChange={(e) => set("costPrice", e.target.value)}
                className={inputCls("costPrice")}
              />
            </div>
          </div>

          {/* Unit + Low Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Unit</label>
              <div className="relative">
                <select
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             outline-none focus:border-amber-400 bg-white appearance-none pr-8"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Low Stock Alert</label>
              <input
                type="number" value={form.lowStockAlert}
                onChange={(e) => set("lowStockAlert", e.target.value)}
                className={inputCls("lowStockAlert")}
              />
            </div>
          </div>

          {/* HSN Code */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">HSN / SAC Code</label>
            <input
              type="text" value={form.hsnCode}
              onChange={(e) => set("hsnCode", e.target.value)}
              className={inputCls("hsnCode")}
            />
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

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-500
                         text-gray-900 active:scale-95 transition-all shadow-sm disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}