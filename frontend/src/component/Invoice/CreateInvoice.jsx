import React, { useState, useEffect, useRef } from 'react'
import { createInvoice, createCustomer, fetchCustomers } from '../../api/invoiceService'

const PAYMENT_MODES = ['UPI', 'Cash', 'Bank Transfer', 'Cheque', 'Card']

const generateLocalInvoiceNumber = () => {
  const year = new Date().getFullYear()
  const num  = Math.floor(1000 + Math.random() * 9000)
  return `INV-${year}-${num}`
}
const today      = () => new Date().toISOString().split('T')[0]
const dueDefault = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] }

// ─── Add New Client Modal ─────────────────────────────────────────────────────
const AddNewClientModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    customerName: '', companyName: '', clientAddress: '',
    gstNo: '', emailAddress: '', phoneNumber: '',
  })
  const [saving, setSaving]   = useState(false)
  const [error,  setError]    = useState(null)
  const backdropRef           = useRef(null)

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleBackdrop = (e) => { if (e.target === backdropRef.current) onClose() }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // ── Save to API, then pass result back to CreateInvoice ──────────────────
  const handleSave = async () => {
    if (!form.customerName.trim()) {
      setError('Customer name is required.')
      return
    }
    try {
      setSaving(true)
      setError(null)
      // POST /api/customers — controller accepts these exact field names
      const customer = await createCustomer(form)
      onSave(customer)   // pass full DB record back (has .id we need for invoice)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save customer.')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { label: 'Customer Name',  key: 'customerName',  type: 'text',     rows: 1 },
    { label: 'Company Name',   key: 'companyName',   type: 'text',     rows: 1 },
    { label: 'Client Address', key: 'clientAddress', type: 'textarea', rows: 3 },
    { label: 'GST No.',        key: 'gstNo',         type: 'text',     rows: 1 },
    { label: 'Email Address',  key: 'emailAddress',  type: 'email',    rows: 1 },
    { label: 'Phone Number',   key: 'phoneNumber',   type: 'tel',      rows: 1 },
  ]

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="relative bg-white h-full w-full max-w-sm flex flex-col shadow-2xl"
        style={{ animation: 'slideInRight 0.22s cubic-bezier(.4,0,.2,1)' }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">Add New Client</h2>
          <button onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-5 mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {fields.map(({ label, key, type, rows }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              {type === 'textarea' ? (
                <textarea rows={rows} value={form[key]} onChange={set(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none" />
              ) : (
                <input type={type} value={form[key]} onChange={set(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 flex-shrink-0">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-500 active:bg-amber-600 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? (
              <>
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save
              </>
            )}
          </button>
          <button onClick={onClose} disabled={saving}
            className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm disabled:opacity-60">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Create Invoice Page ──────────────────────────────────────────────────────
const CreateInvoice = ({ onBack, onSave, onSaveDraft }) => {
  // The invoice number shown in UI — real one comes back from the server after save
  const [invoiceNo]         = useState(generateLocalInvoiceNumber)
  const [date, setDate]     = useState(today())
  const [dueDate, setDueDate] = useState(dueDefault())

  // Customer search
  const [customerSearch, setCustomerSearch]       = useState('')
  const [customerResults, setCustomerResults]     = useState([])
  const [showDropdown, setShowDropdown]           = useState(false)
  const [searchLoading, setSearchLoading]         = useState(false)
  const [selectedCustomer, setSelectedCustomer]   = useState(null)
  const [showAddClient, setShowAddClient]         = useState(false)
  const searchRef                                 = useRef(null)

  // Line items
  const [items, setItems]     = useState([])

  // Note / terms
  const [note, setNote]       = useState('')
  const [terms, setTerms]     = useState('')

  // Payment
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMode, setPaymentMode]     = useState('UPI')
  const [modeOpen, setModeOpen]           = useState(false)

  // Submit state
  const [saving, setSaving]       = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [error, setError]         = useState(null)

  const gstRate = 9   // CGST % (SGST mirrors it)

  // ── Customer live search ────────────────────────────────────────────────────
  useEffect(() => {
    if (!customerSearch.trim() || selectedCustomer) {
      setCustomerResults([])
      setShowDropdown(false)
      return
    }
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true)
        const data = await fetchCustomers({ search: customerSearch, limit: 8 })
        setCustomerResults(data.customers || [])
        setShowDropdown(true)
      } catch (_) {
        setCustomerResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [customerSearch, selectedCustomer])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Items ───────────────────────────────────────────────────────────────────
  const addItem    = () => setItems(p => [...p, { id: Date.now(), name: '', description: '', hsn: '', qty: 1, rate: 0 }])
  const updateItem = (id, field, value) => setItems(p => p.map(it => it.id === id ? { ...it, [field]: value } : it))
  const removeItem = (id) => setItems(p => p.filter(it => it.id !== id))

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const cgst     = subtotal * gstRate / 100
  const sgst     = subtotal * gstRate / 100
  const total    = subtotal + cgst + sgst
  const fmt      = (n) => `₹${Number(n).toFixed(2)}`

  // ── AddNewClientModal saves to API and returns full DB customer record ──────
  const handleClientSave = (dbCustomer) => {
    // dbCustomer = { id, name, gstin, email, phone, ... } from POST /api/customers
    setSelectedCustomer(dbCustomer)
    setCustomerSearch(dbCustomer.name)
    setShowDropdown(false)
  }

  // ── Build the payload the invoice controller expects ────────────────────────
  const buildPayload = () => ({
    customerId:    selectedCustomer?.id,
    date,
    dueDate,
    items:         items.map(it => ({
      name:        it.name,
      description: it.description || null,
      hsn:         it.hsn         || null,
      qty:         Number(it.qty),
      rate:        Number(it.rate),
      taxPercent:  gstRate * 2,   // 18 % total GST per line
    })),
    note,
    terms,
    paymentAmount: Number(paymentAmount),
    paymentMode,
    gstRate,
  })

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (isDraft = false) => {
    if (!selectedCustomer) return 'Please select or add a customer.'
    if (!isDraft && items.length === 0) return 'Add at least one item.'
    if (!isDraft && items.some(it => !it.name.trim())) return 'All items must have a name.'
    return null
  }

  // ── Save (generate invoice) ─────────────────────────────────────────────────
  const handleSave = async () => {
    const err = validate(false)
    if (err) { setError(err); return }
    try {
      setSaving(true)
      setError(null)
      const result = await createInvoice(buildPayload())
      onSave?.(result)
    } catch (err) {
      setError(err.message || 'Failed to save invoice.')
    } finally {
      setSaving(false)
    }
  }

  // ── Save draft (allows empty items) ────────────────────────────────────────
  const handleSaveDraft = async () => {
    const err = validate(true)
    if (err) { setError(err); return }
    try {
      setSavingDraft(true)
      setError(null)
      // Draft: send items as-is (may be empty) — controller sets status=SENT by default;
      // pass an explicit empty array so controller validation doesn't block us
      const payload = { ...buildPayload(), isDraft: true }
      const result  = await createInvoice(payload)
      onSaveDraft?.(result)
    } catch (err) {
      setError(err.message || 'Failed to save draft.')
    } finally {
      setSavingDraft(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {showAddClient && (
        <AddNewClientModal
          onClose={() => setShowAddClient(false)}
          onSave={handleClientSave}
        />
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Create Invoice
        </button>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleSave} disabled={saving || savingDraft}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            )}
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={handleSaveDraft} disabled={saving || savingDraft}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {savingDraft ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            )}
            {savingDraft ? 'Saving…' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* LEFT PANEL */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">

          {/* Invoice No / Date / Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Invoice Number</label>
              <input readOnly value={invoiceNo}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-not-allowed"
                title="Auto-generated by server on save" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Due Date</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Customer search row */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1" ref={searchRef}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              {searchLoading && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              )}
              <input
                type="text"
                placeholder="Search existing customers…"
                value={customerSearch}
                onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null) }}
                onFocus={() => customerResults.length > 0 && setShowDropdown(true)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors bg-white"
              />
              {/* Search results dropdown */}
              {showDropdown && customerResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden">
                  {customerResults.map(c => (
                    <button key={c.id}
                      onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setShowDropdown(false) }}
                      className="w-full text-left px-3 py-2.5 hover:bg-amber-50 transition-colors border-b border-gray-50 last:border-0">
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      {c.gstin && <p className="text-xs text-gray-400 mt-0.5">GST: {c.gstin}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setShowAddClient(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 active:bg-amber-600 transition-colors text-sm whitespace-nowrap flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Customer
            </button>
          </div>

          {/* Selected customer chip */}
          {selectedCustomer && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 flex-shrink-0">
                {(selectedCustomer.name || selectedCustomer.customerName || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {selectedCustomer.name || selectedCustomer.customerName}
                </p>
                {selectedCustomer.gstin && (
                  <p className="text-xs text-gray-500 truncate">GST: {selectedCustomer.gstin}</p>
                )}
              </div>
              <button onClick={() => { setSelectedCustomer(null); setCustomerSearch('') }}
                className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
                      {['Items', 'Description', 'HSN/SAC', 'QTY', 'Rate', 'Amount', ''].map((h, i) => (
                        <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-3 py-6 text-center text-xs text-gray-400">No items added yet</td>
                      </tr>
                    ) : items.map(it => (
                      <tr key={it.id} className="group">
                        <td className="px-2 py-2">
                          <input value={it.name} onChange={e => updateItem(it.id, 'name', e.target.value)} placeholder="Item name"
                            className="w-full min-w-[90px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input value={it.description} onChange={e => updateItem(it.id, 'description', e.target.value)} placeholder="Description"
                            className="w-full min-w-[100px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input value={it.hsn} onChange={e => updateItem(it.id, 'hsn', e.target.value)} placeholder="HSN"
                            className="w-full min-w-[70px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" min="1" value={it.qty} onChange={e => updateItem(it.id, 'qty', e.target.value)}
                            className="w-full min-w-[50px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" min="0" value={it.rate} onChange={e => updateItem(it.id, 'rate', e.target.value)}
                            className="w-full min-w-[70px] px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-amber-400 transition-colors" />
                        </td>
                        <td className="px-3 py-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                          {fmt(Number(it.qty) * Number(it.rate))}
                        </td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeItem(it.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Items
                </button>
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Add a note for the customer…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white" />
          </div>

          {/* Terms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Terms &amp; Condition</label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={4} placeholder="Add terms and conditions…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-64 xl:w-72 flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-4 sm:p-5 space-y-5 lg:sticky lg:top-[57px]">

            {/* Summary */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span className="font-medium text-gray-800">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>CGST ({gstRate}%)</span><span className="font-medium text-gray-800">{fmt(cgst)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>SGST ({gstRate}%)</span><span className="font-medium text-gray-800">{fmt(sgst)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Payment */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Payment Method</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input type="number" min="0" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mode</label>
                  <div className="relative">
                    <button onClick={() => setModeOpen(p => !p)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <span>{paymentMode}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {modeOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-20 overflow-hidden">
                        {PAYMENT_MODES.map(m => (
                          <button key={m} onClick={() => { setPaymentMode(m); setModeOpen(false) }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${m === paymentMode ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* CTA buttons */}
            <div className="space-y-2">
              <button onClick={handleSave} disabled={saving || savingDraft}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-500 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? (
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="13" x2="8" y2="13"/><line x1="12" y1="17" x2="8" y2="17"/>
                  </svg>
                )}
                {saving ? 'Generating…' : 'Generate Invoice'}
              </button>
              <button onClick={handleSaveDraft} disabled={saving || savingDraft}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {savingDraft ? (
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                )}
                {savingDraft ? 'Saving…' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateInvoice