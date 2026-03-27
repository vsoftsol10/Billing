import React from 'react'

const InvoiceHeader = ({ onCreateInvoice }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        
        <h2 className="text-lg text-gray-900 font-bold  mt-1">
          Manage your invoices and track payments easily
        </h2>
      </div>
      <button
        onClick={onCreateInvoice}
        className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create Invoice
      </button>
    </div>
  )
}

export default InvoiceHeader
