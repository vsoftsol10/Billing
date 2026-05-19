import { useEffect, useState } from 'react';
import { fetchPurchaseById } from '../../api/purchaseService';
import { statusStyles, modeStyles, formatINR } from './purchaseConstants';

/* ── tiny helpers ── */
const Field = ({ label, value, wide }) => (
  <div className={`flex flex-col gap-1 ${wide ? 'col-span-2' : ''}`}>
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    <span className="text-sm text-gray-800 font-medium break-words">{value ?? '—'}</span>
  </div>
);

const Divider = () => <div className="col-span-2 border-t border-dashed border-gray-100 my-1" />;

export default function PurchaseViewModal({ purchaseId, onClose }) {
  const [purchase, setPurchase] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!purchaseId) return;
    setLoading(true);
    setError(null);
    fetchPurchaseById(purchaseId)
      .then(data => {
    console.log('RAW purchase data:', data); // ← add this
    setPurchase(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [purchaseId]);

  /* close on backdrop click */
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Purchase Details</h2>
              {purchase && <p className="text-xs text-gray-400">{purchase.id}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Loading…
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm py-10 justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && purchase && (
  <div className="grid grid-cols-2 gap-x-6 gap-y-4">

    <Field label="Purchase No."  value={purchase.purchaseNumber} />
    <Field label="Date"          value={new Date(purchase.purchaseDate).toLocaleDateString('en-IN')} />
    <Field label="Vendor"        value={purchase.supplier?.name} wide />

    <Divider />

    <Field label="Subtotal"      value={formatINR(purchase.subtotal)} />
    <Field label="CGST"          value={formatINR(purchase.cgst)} />
    <Field label="SGST"          value={formatINR(purchase.sgst)} />
    <Field label="Total Amount"  value={formatINR(purchase.totalAmount)} />

    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Mode</span>
      <span className={`inline-flex self-start text-xs font-bold px-2.5 py-1 rounded-md ${modeStyles[purchase.payment_mode] || 'bg-gray-100 text-gray-500'}`}>
        {purchase.payment_mode?.replace('_', ' ') || '—'}
      </span>
    </div>

    <Divider />

    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</span>
      <span className={`inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded-lg ${statusStyles[purchase.status] || 'bg-gray-100 text-gray-500'}`}>
        {purchase.status || '—'}
      </span>
    </div>

    {purchase.notes && <Field label="Notes" value={purchase.notes} wide />}
    {purchase.terms && <Field label="Terms" value={purchase.terms} wide />}

  </div>
)}
        </div>

        {/* ── Footer ── */}
        {!loading && !error && purchase && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn .18s ease both; }
      `}</style>
    </div>
  );
}