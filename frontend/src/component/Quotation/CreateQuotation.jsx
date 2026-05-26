import React, { useState, useEffect, useRef } from 'react'
import { listCustomers, createCustomer } from '../../api/customerService'

const PAYMENT_MODES = ['UPI', 'Cash', 'Bank Transfer', 'Cheque', 'Card']

const generateQuotationNumber = () => {
  const year = new Date().getFullYear()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `QUO-${year}-${num}`
}
const today = () => new Date().toISOString().split('T')[0]
const dueDefault = () => {
  const d = new Date(); d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

// ─── Add New Client Modal ─────────────────────────────────────────────────────
const AddNewClientModal = ({ onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    address: '',
  })

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const backdropRef = useRef(null)
  const handleBackdrop = (e) => { if (e.target === backdropRef.current) onClose() }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    if (!form.name.trim()) return
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      alert(`Failed to create customer: ${err.message}`)
    }
  }

  const fields = [
    { label: 'Customer Name',  key: 'name',    type: 'text',  rows: 1 },
    { label: 'Email',          key: 'email',   type: 'email', rows: 1 },
    { label: 'Phone',          key: 'phone',   type: 'tel',   rows: 1 },
    { label: 'GST No.',        key: 'gstin',   type: 'text',  rows: 1 },
    { label: 'Address',        key: 'address', type: 'textarea', rows: 3 },
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

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">Add New Customer</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {fields.map(({ label, key, type, rows }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  rows={rows}
                  value={form[key]}
                  onChange={set(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={form[key]}
                  onChange={set(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-500 active:bg-amber-600 disabled:opacity-50 transition-colors text-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Create Quotation Page ────────────────────────────────────────────────────
const CreateQuotation = ({ onBack, onSave, onSaveDraft }) => {
  const [quotationNo] = useState(generateQuotationNumber)
  const [date, setDate] = useState(today())
  const [validUntil, setValidUntil] = useState(dueDefault())
  
  // Customer management
  const [customers, setCustomers] = useState([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [savingCustomer, setSavingCustomer] = useState(false)

  const customerDropdownRef = useRef(null)

  // Items & payment
  const [items, setItems] = useState([])
  const [note, setNote] = useState('')
  const [terms, setTerms] = useState('')
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMode, setPaymentMode] = useState('UPI')
  const [modeOpen, setModeOpen] = useState(false)
  const [gstRate] = useState(9)

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true)
      try {
        const data = await listCustomers()
        setCustomers(data)
      } catch (err) {
        console.error('Failed to fetch customers:', err)
      } finally {
        setLoadingCustomers(false)
      }
    }
    fetchCustomers()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
        setShowCustomerDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter customers by search
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
    (c.phone && c.phone.includes(customerSearch))
  )

  const handleAddCustomer = async (formData) => {
    setSavingCustomer(true)
    try {
      const newCustomer = await createCustomer(formData)
      setCustomers(p => [...p, newCustomer])
      setSelectedCustomer(newCustomer)
      setCustomerSearch(newCustomer.name)
      setShowCustomerDropdown(false)
    } catch (err) {
      throw err
    } finally {
      setSavingCustomer(false)
    }
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setCustomerSearch(customer.name)
    setShowCustomerDropdown(false)
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
    setCustomerSearch('')
  }

  const addItem = () => setItems(p => [...p, { id: Date.now(), name: '', description: '', hsn: '', qty: 1, rate: 0 }])
  const updateItem = (id, field, value) => setItems(p => p.map(it => it.id === id ? { ...it, [field]: value } : it))
  const removeItem = (id) => setItems(p => p.filter(it => it.id !== id))

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0)
  const cgst = subtotal * gstRate / 100
  const sgst = subtotal * gstRate / 100
  const total = subtotal + cgst + sgst
  const fmt = (n) => `₹${Number(n).toFixed(2)}`

  const payload = () => ({
    customerId: selectedCustomer?.id || null,
    issueDate: date,
    validUntil,
    items,
    notes: note,
    terms,
    paidAmount: paymentAmount,
    paymentMode: paymentMode.toUpperCase().replace(' ', '_'),
    gstRate,
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {showAddClient && (
        <AddNewClientModal
          onClose={() => setShowAddClient(false)}
          onSave={handleAddCustomer}
          isLoading={savingCustomer}
        />
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Create Quotation
        </button>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onSave?.(payload())}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save
          </button>
          <button
            onClick={() => onSaveDraft?.(payload())}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Draft
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* LEFT PANEL */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">

          {/* Quotation No / Date / Valid Until */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quotation Number</label>
              <input readOnly value={quotationNo}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-not-allowed" />
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
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Valid Until</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Customer row */}
          <div className="space-y-3">
            <div className="flex gap-3 items-stretch">
              <div ref={customerDropdownRef} className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder={loadingCustomers ? "Loading customers..." : "Search or select customer"}
                  value={customerSearch}
                  onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true) }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  disabled={loadingCustomers}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors bg-white disabled:bg-gray-100"
                />
                {showCustomerDropdown && customerSearch && !selectedCustomer && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(customer => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{customer.name}</div>
                          {customer.email && <div className="text-xs text-gray-500">{customer.email}</div>}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-6 text-center text-xs text-gray-400">
                        No customers found matching "{customerSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAddClient(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-500 active:bg-amber-600 transition-colors text-sm whitespace-nowrap flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Customer
              </button>
            </div>

            {/* Selected customer chip */}
            {selectedCustomer && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg w-fit">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{selectedCustomer.name}</p>
                  {selectedCustomer.email && (
                    <p className="text-xs text-gray-500 truncate">{selectedCustomer.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClearCustomer}
                  className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Terms &amp; Conditions</label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={4} placeholder="Add terms and conditions…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors resize-none bg-white" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-64 xl:w-72 flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-4 sm:p-5 space-y-5 lg:sticky lg:top-[57px]">

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

            <div className="space-y-2">
              <button
                onClick={() => onSave?.(payload())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-500 transition-colors text-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="13" x2="8" y2="13"/><line x1="12" y1="17" x2="8" y2="17"/>
                </svg>
                Generate Quotation
              </button>
              <button
                onClick={() => onSaveDraft?.(payload())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuotation