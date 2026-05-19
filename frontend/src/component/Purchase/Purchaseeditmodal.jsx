import { useEffect, useState } from 'react';
import { fetchPurchaseById, updatePurchase } from '../../api/purchaseService';
import { statusOptions, modeOptions } from './purchaseConstants';

/* ── reusable form field wrappers ── */
const Label = ({ children }) => (
  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{children}</span>
);

const inputCls = "w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition placeholder-gray-300";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

export default function PurchaseEditModal({ purchaseId, onClose, onSaved }) {
  const [form,    setForm]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  /* ── load record ── */
  useEffect(() => {
    if (!purchaseId) return;
    setLoading(true);
    setError(null);
    fetchPurchaseById(purchaseId)
  .then(data => {
    setForm({
      vendor:        data.supplier?.name                                          ?? '',
      amount:        parseFloat(data.totalAmount        ?? 0).toString(),        // ← parse string Decimal
      date:          data.purchaseDate
                       ? new Date(data.purchaseDate).toISOString().split('T')[0]
                       : '',
      status:        data.status                                                  ?? '',
      mode:          data.payment_mode                                            ?? '',
      notes:         data.notes                                                   ?? '',
      terms:         data.terms                                                   ?? '',
      gst:           '',
      taxAmount:     '',
      invoiceNumber: data.purchaseNumber                                          ?? '',
    });
  })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [purchaseId]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  /* ── save ── */
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        vendor:        form.vendor,
        amount:        parseFloat(form.amount),
        date:          form.date,
        status:        form.status,
        paymentMode:   form.mode,
        gst:           form.gst !== '' ? parseFloat(form.gst) : undefined,
        taxAmount:     form.taxAmount !== '' ? parseFloat(form.taxAmount) : undefined,
        invoiceNumber: form.invoiceNumber || undefined,
        notes:         form.notes         || undefined,
      };
      const updated = await updatePurchase(purchaseId, payload);
      onSaved?.(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── backdrop click ── */
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Edit Purchase</h2>
              <p className="text-xs text-gray-400">ID: {purchaseId}</p>
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
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">

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
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          {!loading && form && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">

              {/* Vendor – full width */}
              <div className="col-span-2">
                <Label>Vendor</Label>
                <input className={inputCls} value={form.vendor} onChange={set('vendor')} placeholder="Vendor name" />
              </div>

              {/* Amount + Date */}
              <div>
                <Label>Amount (₹)</Label>
                <input className={inputCls} type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" />
              </div>
              <div>
                <Label>Date</Label>
                <input className={inputCls} type="date" value={form.date} onChange={set('date')} />
              </div>

              {/* Status + Mode */}
              <div className="relative">
                <Label>Status</Label>
                <select className={selectCls} value={form.status} onChange={set('status')}>
                  <option value="">Select status</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-[58%] w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="relative">
                <Label>Payment Mode</Label>
                <select className={selectCls} value={form.mode} onChange={set('mode')}>
                  <option value="">Select mode</option>
                  {modeOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-[58%] w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* GST + Tax Amount */}
              <div>
                <Label>GST (%)</Label>
                <input className={inputCls} type="number" min="0" max="100" step="0.01" value={form.gst} onChange={set('gst')} placeholder="e.g. 18" />
              </div>
              <div>
                <Label>Tax Amount (₹)</Label>
                <input className={inputCls} type="number" min="0" step="0.01" value={form.taxAmount} onChange={set('taxAmount')} placeholder="0.00" />
              </div>

              {/* Invoice number – full width */}
              <div className="col-span-2">
                <Label>Invoice / Reference No.</Label>
                <input className={inputCls} value={form.invoiceNumber} onChange={set('invoiceNumber')} placeholder="INV-0001" />
              </div>

              {/* Notes – full width */}
              <div className="col-span-2">
                <Label>Notes</Label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="Any additional notes…"
                />
              </div>

            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && form && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-amber-400 hover:bg-amber-500 text-white rounded-xl transition disabled:opacity-60 shadow-sm"
            >
              {saving && (
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
              {saving ? 'Saving…' : 'Save Changes'}
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