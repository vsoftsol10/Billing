import React, { useRef, useEffect } from 'react'

const ViewQuotationModal = ({ quotation, onClose }) => {
  const backdropRef = useRef(null)

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!quotation) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        style={{ animation: 'slideInUp 0.22s cubic-bezier(.4,0,.2,1)' }}
      >
        <style>{`
          @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quotation {quotation.id}</h2>
            <p className="text-sm text-gray-500 mt-0.5">View quotation details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {/* Client & Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Client</label>
                <p className="text-sm font-medium text-gray-900">{quotation.client}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount</label>
                <p className="text-sm font-bold text-green-600">{quotation.amount}</p>
              </div>
            </div>

            {/* Date & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                <p className="text-sm text-gray-700">{quotation.date}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <div className="inline-block">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(quotation.status)}`}>
                    {quotation.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4" />

            {/* Additional details */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-700">Quotation ID:</strong> {quotation.id}
              </p>
              <p className="text-xs text-gray-500">
                For complete details and editing options, use the Edit button.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const getStatusClass = (status) => {
  const mapping = {
    Open:      'bg-green-100 text-green-800',
    Closed:    'bg-blue-100 text-blue-800',
    Partial:   'bg-indigo-100 text-indigo-800',
    Pending:   'bg-amber-100 text-amber-800',
    Cancelled: 'bg-red-100 text-red-800',
    Draft:     'bg-gray-100 text-gray-800',
  }
  return mapping[status] || 'bg-gray-100 text-gray-800'
}

export default ViewQuotationModal
