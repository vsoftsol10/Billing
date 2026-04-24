import { useState } from "react";

const PAYMENT_MODES = ["UPI", "Cash", "Card", "Net Banking", "Cheque"];

const generatePurchaseNumber = () => {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PUR-${year}-${num}`;
};
const today = () => new Date().toISOString().split("T")[0];

export default function CreatePurchase({ onBack, onSave, onSaveDraft }) {
  const [purchaseNo] = useState(generatePurchaseNumber);
  const [date, setDate] = useState(today());
  const [vendorOpen, setVendorOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [terms, setTerms] = useState("");
  const [vendor, setVendor] = useState({
    name: "", email: "", phone: "", gst: "", address: "",
  });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearch, setVendorSearch] = useState("");

  const addItem = () =>
    setItems([...items, { id: Date.now(), name: "", description: "", hsn: "", qty: "", rate: "", amount: "" }]);

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const updateItem = (id, field, value) =>
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "qty" || field === "rate") {
        const qty = parseFloat(field === "qty" ? value : item.qty) || 0;
        const rate = parseFloat(field === "rate" ? value : item.rate) || 0;
        updated.amount = (qty * rate).toFixed(2);
      }
      return updated;
    }));

  const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;
  const fmt = (n) => `₹${Number(n).toFixed(2)}`;

  const payload = () => ({ purchaseNo, date, vendor: selectedVendor, items, note, terms, total });

  const handleVendorSave = () => {
    if (!vendor.name.trim()) return;
    setSelectedVendor(vendor);
    setVendorSearch(vendor.name);
    setVendorOpen(false);
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col overflow-auto">

      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          Create Purchase
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => onSave?.(payload())}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
          <button
            onClick={() => onSaveDraft?.(payload())}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
            </svg>
            Save Draft
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* LEFT PANEL */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">

          {/* Purchase No / Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Purchase Number</label>
              <input
                readOnly value={purchaseNo}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Purchase Date</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-gray-100 text-gray-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Vendor Search + Add */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search vendor..."
                value={vendorSearch}
                onChange={e => setVendorSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <button
              onClick={() => setVendorOpen(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Vendor
            </button>
          </div>

          {/* Selected vendor chip */}
          {selectedVendor && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 flex-shrink-0">
                {selectedVendor.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{selectedVendor.name}</p>
                {selectedVendor.gst && <p className="text-xs text-gray-500 truncate">{selectedVendor.gst}</p>}
              </div>
              <button
                onClick={() => { setSelectedVendor(null); setVendorSearch(""); }}
                className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* Items Table */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Items</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Items", "Description", "HSN/SAC", "QTY", "Rate", "Amount", ""].map((h, i) => (
                        <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-3 py-6 text-center text-xs text-gray-400">No items added yet</td>
                      </tr>
                    ) : items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="px-2 py-2">
                          <input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} placeholder="Item name"
                            className="w-full min-w-[90px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} placeholder="Description"
                            className="w-full min-w-[100px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input value={item.hsn} onChange={e => updateItem(item.id, "hsn", e.target.value)} placeholder="HSN"
                            className="w-full min-w-[70px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" min="1" value={item.qty} onChange={e => updateItem(item.id, "qty", e.target.value)}
                            className="w-full min-w-[50px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" min="0" value={item.rate} onChange={e => updateItem(item.id, "rate", e.target.value)}
                            className="w-full min-w-[70px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-3 py-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                          {fmt(item.amount || 0)}
                        </td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-2.5 bg-white border-t border-gray-100">
                <button onClick={addItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors text-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Items
                </button>
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add a note…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white" />
          </div>

          {/* Terms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Terms &amp; Condition</label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3} placeholder="Add terms and conditions…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-56 xl:w-64 flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-4 sm:p-5 space-y-5 lg:sticky lg:top-[57px]">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Summary</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span className="font-medium text-gray-800">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>CGST (9%)</span><span className="font-medium text-gray-800">{fmt(cgst)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>SGST (9%)</span><span className="font-medium text-gray-800">{fmt(sgst)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="space-y-2">
              <button
                onClick={() => onSave?.(payload())}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm py-2.5 rounded-lg transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Generate Purchase
              </button>
              <button
                onClick={() => onSaveDraft?.(payload())}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm py-2.5 rounded-lg transition-colors">
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

      {/* Add Vendor Slide Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${vendorOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-base">Add Vendor</p>
          <button onClick={() => setVendorOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

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
                type={type} placeholder={placeholder} value={vendor[key]}
                onChange={e => setVendor({ ...vendor, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Address</label>
            <textarea
              rows={3} placeholder="Enter full address" value={vendor.address}
              onChange={e => setVendor({ ...vendor, address: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleVendorSave}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold text-sm py-2.5 rounded-lg transition-colors"
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