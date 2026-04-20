import { useState } from "react";

export default function CreatePurchase() {
  const [vendorOpen, setVendorOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    gst: "",
    address: "",
  });

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", description: "", hsn: "", qty: "", rate: "", amount: "" },
    ]);
  };

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "rate") {
          const qty = parseFloat(field === "qty" ? value : item.qty) || 0;
          const rate = parseFloat(field === "rate" ? value : item.rate) || 0;
          updated.amount = (qty * rate).toFixed(2);
        }
        return updated;
      })
    );
  };

  const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-5xl mx-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Create Purchase
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
              </svg>
              Save Draft
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Left: Form */}
          <div className="flex-1 p-6 space-y-6 min-w-0">

            {/* Date + Invoice */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Purchase Date</label>
                <input
                  type="text"
                  defaultValue="INV-2026"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Invoice Number</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <input
                    type="text"
                    defaultValue="10/03/25"
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>
              </div>
            </div>

            {/* Vendor Search + Add */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search vendor..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
              <button
                onClick={() => setVendorOpen(true)}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Vendor
              </button>
            </div>

            {/* Items Table */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Items</p>
              <div className="grid grid-cols-[1.5fr_2fr_1fr_0.7fr_1fr_1fr_28px] gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <span>Items</span>
                <span>Description</span>
                <span>HSN/SAC</span>
                <span>QTY</span>
                <span>Rate</span>
                <span>Amount</span>
                <span />
              </div>

              {items.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-300">No items added yet</div>
              )}

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1.5fr_2fr_1fr_0.7fr_1fr_1fr_28px] gap-2 mt-2 items-center">
                  <input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Item name" className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-yellow-400" />
                  <input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Description" className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-yellow-400" />
                  <input value={item.hsn} onChange={(e) => updateItem(item.id, "hsn", e.target.value)} placeholder="HSN" className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-yellow-400" />
                  <input value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} placeholder="0" type="number" className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-yellow-400" />
                  <input value={item.rate} onChange={(e) => updateItem(item.id, "rate", e.target.value)} placeholder="0.00" type="number" className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-yellow-400" />
                  <input value={item.amount} readOnly placeholder="0.00" className="border border-gray-100 rounded-lg px-2 py-2 text-sm bg-gray-50 text-gray-600" />
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors flex items-center justify-center">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                onClick={addItem}
                className="mt-3 flex items-center gap-1.5 border border-dashed border-gray-300 hover:border-yellow-400 text-yellow-500 hover:bg-yellow-50 font-semibold text-sm px-4 py-2 rounded-lg transition-all"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Items
              </button>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
              <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 resize-none focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100" />
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Terms &amp; Condition</label>
              <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 resize-none focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100" />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-56 border-l border-gray-100 p-5 flex flex-col gap-3 shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Summary</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>CGST</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>SGST</span>
                <span>₹0.00</span>
              </div>
              <div className="h-px bg-gray-100 my-1" />
              <div className="flex justify-between font-semibold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-xs px-3 py-2.5 rounded-lg transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Generate Invoice
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs px-3 py-2.5 rounded-lg transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
                </svg>
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setVendorOpen(false)}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${vendorOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Slide Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${vendorOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-base">Add Vendor</p>
          <button onClick={() => setVendorOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {[
            { label: "Vendor Name", key: "name", type: "text", placeholder: "Enter vendor name" },
            { label: "Email Address", key: "email", type: "email", placeholder: "vendor@example.com" },
            { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 00000 00000" },
            { label: "GST Number", key: "gst", type: "text", placeholder: "22AAAAA0000A1Z5" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={vendor[key]}
                onChange={(e) => setVendor({ ...vendor, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Address</label>
            <textarea
              rows={3}
              placeholder="Enter full address"
              value={vendor.address}
              onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => setVendorOpen(false)}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
          <button
            onClick={() => setVendorOpen(false)}
            className="flex-1 flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}