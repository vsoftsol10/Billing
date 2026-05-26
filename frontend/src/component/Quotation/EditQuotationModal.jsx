import React, { useState, useEffect, useRef } from 'react'

const EditQuotationModal = ({ quotation, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    client: '',
    amount: '',
    status: 'Open',
  })

  const backdropRef = useRef(null)

  // Initialize form with quotation data
  useEffect(() => {
    if (quotation) {
      setForm({
        client: quotation.client || '',
        amount: quotation.amount?.replace(/[^\d.]/g, '') || '',
        status: quotation.status || 'Open',
      })
    }
  }, [quotation])

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

  const handleSave = async () => {
    if (!form.client.trim()) {
      alert('Client name is required')
      return
    }
    try {
      await onSave(quotation._id, form)
      onClose()
    } catch (err) {
      alert(`Failed to save: ${err.message}`)
    }
  }

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const STATUS_OPTIONS = ['Open', 'Closed', 'Partial', 'Pending', 'Cancelled', 'Draft']

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

  if (!quotation) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col"
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
            <h2 className="text-lg font-bold text-gray-900">Edit Quotation</h2>
            <p className="text-sm text-gray-500 mt-0.5">{quotation.id}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Client */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client Name</label>
            <input
              type="text"
              value={form.client}
              onChange={set('client')}
              placeholder="Enter client name"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors disabled:bg-gray-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                type="number"
                value={form.amount}
                onChange={set('amount')}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isLoading}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={set('status')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors disabled:bg-gray-100"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 active:bg-amber-600 disabled:opacity-50 transition-colors text-sm"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditQuotationModal
