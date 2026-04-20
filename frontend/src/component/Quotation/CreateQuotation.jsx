import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────
// QuotationHeader Component
// ─────────────────────────────────────────
const QuotationHeader = ({ quotationNumber, date, dueDate, onDateChange, onDueDateChange }) => (
  <div className="bg-white rounded-lg p-5 flex gap-4">
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs font-medium text-gray-500">Quotation Number</label>
      <input className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white focus:border-yellow-400" value={quotationNumber} readOnly />
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs font-medium text-gray-500">Date</label>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none">📅</span>
        <input type="date" className="border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm outline-none w-full focus:border-yellow-400" value={date} onChange={(e) => onDateChange(e.target.value)} />
      </div>
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs font-medium text-gray-500">Due Date</label>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none">📅</span>
        <input type="date" className="border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm outline-none w-full focus:border-yellow-400" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// CustomerSearch Component
// ─────────────────────────────────────────
const CustomerSearch = ({ onAddCustomer, selectedCustomer }) => {
  const [search, setSearch] = useState("");
  return (
    <div className="bg-white rounded-lg p-4 flex gap-3 items-center">
      <div className="flex-1 relative flex items-center">
        <span className="absolute left-2.5 text-xs text-gray-400 pointer-events-none">🔍</span>
        <input
          className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm outline-none focus:border-yellow-400"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {selectedCustomer && (
          <span className="ml-2 bg-yellow-400 text-yellow-900 px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
            {selectedCustomer}
          </span>
        )}
      </div>
      <button
        onClick={onAddCustomer}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
      >
        + Add Customer
      </button>
    </div>
  );
};

// ─────────────────────────────────────────
// ItemsTable Component
// ─────────────────────────────────────────
const ItemsTable = ({ items, onAddItem, onRemoveItem, onItemChange }) => {
  const getAmount = (qty, rate) => (parseFloat(qty || 0) * parseFloat(rate || 0)).toFixed(2);

  return (
    <div className="bg-white rounded-lg p-5">
      <p className="text-sm font-semibold text-gray-800 mb-3">Items</p>
      <div className="border border-gray-200 rounded-md overflow-hidden mb-3">
        <div className="flex bg-gray-50 border-b border-gray-200 px-3 py-2 gap-2 text-xs font-semibold text-gray-500">
          <span className="flex-[2]">Items</span>
          <span className="flex-[2.5]">Description</span>
          <span className="flex-[1.5]">HSN/SAC</span>
          <span className="flex-[1]">QTY</span>
          <span className="flex-[1.2]">Rate</span>
          <span className="flex-[1.2]">Amount</span>
          <span className="w-5"></span>
        </div>
        <div className="min-h-[44px]">
          {items.length === 0 ? (
            <div className="h-11" />
          ) : (
            items.map((item, i) => (
              <div key={i} className="flex items-center px-3 py-1.5 gap-2 border-b border-gray-100 last:border-b-0">
                <input className="flex-[2] border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-yellow-400" value={item.name} placeholder="Item name" onChange={(e) => onItemChange(i, "name", e.target.value)} />
                <input className="flex-[2.5] border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-yellow-400" value={item.desc} placeholder="Description" onChange={(e) => onItemChange(i, "desc", e.target.value)} />
                <input className="flex-[1.5] border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-yellow-400" value={item.hsn} placeholder="HSN/SAC" onChange={(e) => onItemChange(i, "hsn", e.target.value)} />
                <input type="number" className="flex-[1] border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-yellow-400" value={item.qty} placeholder="0" onChange={(e) => onItemChange(i, "qty", e.target.value)} />
                <input type="number" className="flex-[1.2] border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-yellow-400" value={item.rate} placeholder="0.00" onChange={(e) => onItemChange(i, "rate", e.target.value)} />
                <span className="flex-[1.2] text-xs font-medium text-gray-700">₹{getAmount(item.qty, item.rate)}</span>
                <button onClick={() => onRemoveItem(i)} className="w-5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded text-xs transition-colors">✕</button>
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={onAddItem}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
      >
        + Add Items
      </button>
    </div>
  );
};

// ─────────────────────────────────────────
// NoteAndTerms Component
// ─────────────────────────────────────────
const NoteAndTerms = ({ note, terms, onNoteChange, onTermsChange }) => (
  <div className="flex flex-col gap-4">
    <div className="bg-white rounded-lg p-5">
      <p className="text-sm font-semibold text-gray-800 mb-2">Note</p>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none focus:border-yellow-400"
        rows={4}
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
      />
    </div>
    <div className="bg-white rounded-lg p-5">
      <p className="text-sm font-semibold text-gray-800 mb-2">Terms &amp; Condition</p>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none focus:border-yellow-400"
        rows={4}
        value={terms}
        onChange={(e) => onTermsChange(e.target.value)}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────
// SummaryPanel Component
// ─────────────────────────────────────────
const SummaryPanel = ({ subtotal, cgst, sgst, total, onGenerateInvoice, onSaveDraft }) => (
  <div className="w-56 min-w-[210px] bg-white rounded-lg p-5 flex flex-col gap-3 sticky top-5">
    <p className="text-sm font-bold text-gray-800">Summary</p>
    <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Subtotal</span><span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>CGST</span><span className="font-medium text-gray-800">₹{cgst.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>SGST</span><span className="font-medium text-gray-800">₹{sgst.toFixed(2)}</span>
      </div>
    </div>
    <div className="flex justify-between text-base font-bold text-gray-800">
      <span>Total</span><span>₹{total.toFixed(2)}</span>
    </div>
    <div className="flex flex-col gap-2 mt-1">
      <button
        onClick={onGenerateInvoice}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        🧾 Generate Invoice
      </button>
      <button
        onClick={onSaveDraft}
        className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-sm py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        💾 Save Draft
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────
// AddClientSlider Component
// ─────────────────────────────────────────
const AddClientSlider = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    customerName: "", companyName: "", clientAddress: "",
    gstNo: "", emailAddress: "", phoneNumber: "",
  });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onSave(form);
    setForm({ customerName: "", companyName: "", clientAddress: "", gstNo: "", emailAddress: "", phoneNumber: "" });
  };

  const fields = [
    { label: "Customer Name", field: "customerName", type: "text" },
    { label: "Company Name", field: "companyName", type: "text" },
    { label: "GSt No.", field: "gstNo", type: "text" },
    { label: "Email Address", field: "emailAddress", type: "email" },
    { label: "Phone Number", field: "phoneNumber", type: "tel" },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black z-[100] transition-opacity duration-300 ${isOpen ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white z-[200] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">Add New Client</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded px-2 py-1 text-sm transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {fields.map(({ label, field, type }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{label}</label>
              <input
                type={type}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none w-full focus:border-yellow-400 transition-colors"
                value={form[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Client Address</label>
            <textarea
              className="border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none w-full resize-none focus:border-yellow-400 transition-colors"
              rows={3}
              value={form.clientAddress}
              onChange={(e) => handleChange("clientAddress", e.target.value)}
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            💾 Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-sm py-2.5 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────
// Main CreateQuotation Component
// ─────────────────────────────────────────
const CreateQuotation = () => {
  const navigate = useNavigate();

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [date, setDate] = useState("2025-10-03");
  const [dueDate, setDueDate] = useState("2025-10-03");
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [terms, setTerms] = useState("");

  const handleAddItem = () =>
    setItems((prev) => [...prev, { name: "", desc: "", hsn: "", qty: "", rate: "" }]);

  const handleRemoveItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleItemChange = (index, field, value) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.qty || 0) * parseFloat(item.rate || 0), 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  const handleSaveClient = (clientData) => {
    setSelectedCustomer(clientData.customerName || clientData.companyName);
    setIsSliderOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200">
        <button
          onClick={() => navigate('/quotation')}
          className="bg-transparent border-none text-[15px] font-semibold cursor-pointer text-gray-800 flex items-center gap-1.5 hover:text-yellow-500 transition-colors"
        >
          ← Create Quotation
        </button>
        <div className="flex gap-2.5">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors">
            💾 Save
          </button>
          <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-sm px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors">
            💾 Save Draft
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 p-5 items-start">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <QuotationHeader
            quotationNumber="QT -1350"
            date={date}
            dueDate={dueDate}
            onDateChange={setDate}
            onDueDateChange={setDueDate}
          />
          <CustomerSearch
            onAddCustomer={() => setIsSliderOpen(true)}
            selectedCustomer={selectedCustomer}
          />
          <ItemsTable
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
          />
          <NoteAndTerms
            note={note}
            terms={terms}
            onNoteChange={setNote}
            onTermsChange={setTerms}
          />
        </div>

        <SummaryPanel
          subtotal={subtotal}
          cgst={cgst}
          sgst={sgst}
          total={total}
          onGenerateInvoice={() => alert("Generating Invoice...")}
          onSaveDraft={() => alert("Saved as Draft")}
        />
      </div>

      {/* Slide-in Client Panel */}
      <AddClientSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default CreateQuotation;