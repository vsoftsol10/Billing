import { useState, useRef, useCallback, useEffect } from 'react';
import { statusStyles, formatINR, statusOptions, modeOptions, modeStyles } from './purchaseConstants';
import PurchaseViewModal from './PurchaseViewModal';
import PurchaseEditModal from './PurchaseEditModal';

/* ─── Status dropdown cell ─── */
function StatusCell({ row, rowIndex, onUpdateStatus }) {
  const [open, setOpen]     = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef  = useRef(null);
  const dropRef = useRef(null);
  const close   = useCallback(() => setOpen(false), []);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 6, left: r.left });
    }
    setOpen(p => !p);
  };

  /* outside-click */
useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropRef.current  && !dropRef.current.contains(e.target) &&
          btnRef.current   && !btnRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  return (
    <td className="py-3 px-3 sm:px-4 text-center">
      <button ref={btnRef} type="button" onClick={toggle}
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 sm:px-3 py-1 rounded-lg ${statusStyles[row.status] || 'bg-gray-100 text-gray-500'}`}>
        {row.status}
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div ref={dropRef} style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
          className="min-w-[130px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {statusOptions.map(status => (
            <button key={status} type="button"
              onClick={() => { onUpdateStatus?.(rowIndex, status); close(); }}
              className={`w-full px-3 py-2 text-left text-xs sm:text-sm ${status === row.status ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>
              {status}
            </button>
          ))}
        </div>
      )}
    </td>
  );
}

/* ─── Mode dropdown cell ─── */
function ModeCell({ row, rowIndex, onUpdateMode }) {
  const [open, setOpen]     = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef  = useRef(null);
  const dropRef = useRef(null);
  const close   = useCallback(() => setOpen(false), []);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 6, left: r.left });
    }
    setOpen(p => !p);
  };

  return (
    <td className="py-3 px-3 sm:px-4 text-center">
      <button ref={btnRef} type="button" onClick={toggle}
        className={`inline-flex items-center gap-1 text-xs font-bold px-2 sm:px-3 py-1 rounded-md ${modeStyles[row.mode] || 'bg-gray-100 text-gray-500'}`}>
        <span className="hidden sm:inline">{row.mode}</span>
        <span className="sm:hidden">{row.mode?.slice(0, 3)}</span>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div ref={dropRef} style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
          className="min-w-[130px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {modeOptions.map(mode => (
            <button key={mode} type="button"
              onClick={() => { onUpdateMode?.(rowIndex, mode); close(); }}
              className={`w-full px-3 py-2 text-left text-xs sm:text-sm ${mode === row.mode ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>
              {mode}
            </button>
          ))}
        </div>
      )}
    </td>
  );
}

/* ─── Main table ─── */
export default function PurchaseTable({ filtered, loading, onUpdateStatus, onUpdateMode, onDelete, onRefresh }) {
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading purchases…
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm" style={{ minWidth: '520px' }}>
          <thead>
            <tr className="border-b border-gray-100">
              {['ID', 'Vendor', 'Mode', 'Amount', 'Date', 'Status', 'Action'].map((col) => (
                <th key={col}
                  className={`py-3 px-3 sm:px-4 text-center text-xs font-bold text-black-500 uppercase tracking-wide ${col === 'Date' ? 'hidden sm:table-cell' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">No purchases found</td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={row._id || i} className="border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors">

                  <td className="py-3 px-3 sm:px-4 text-center text-gray-700 text-xs sm:text-sm">{row.id}</td>

                  <td className="py-3 px-3 sm:px-4 text-center text-gray-700 text-xs sm:text-sm max-w-[100px] truncate">{row.vendor}</td>

                  <ModeCell row={row} rowIndex={i} onUpdateMode={onUpdateMode} />

                  <td className="py-3 px-3 sm:px-4 text-center text-gray-700 font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {formatINR(row.amount)}
                  </td>

                  <td className="py-3 px-3 sm:px-4 text-center text-gray-500 text-xs sm:text-sm hidden sm:table-cell">{row.date}</td>

                  <StatusCell row={row} rowIndex={i} onUpdateStatus={onUpdateStatus} />

                  {/* ── Actions ── */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">

                      {/* 👁 View */}
                      <button
                        onClick={() => setViewId(row._id || row.id)}
                        className="p-1 sm:p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-500 transition"
                        title="View"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      {/* ✏️ Edit */}
                      <button
                        onClick={() => setEditId(row._id || row.id)}
                        className="p-1 sm:p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition"
                        title="Edit"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* 🗑 Delete */}
                      <button
                        onClick={() => onDelete?.(i)}
                        className="p-1 sm:p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modals ── */}
      {viewId && (
        <PurchaseViewModal
          purchaseId={viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {editId && (
        <PurchaseEditModal
          purchaseId={editId}
          onClose={() => setEditId(null)}
          onSaved={() => { onRefresh?.(); }}
        />
      )}
    </>
  );
}