// AddUserModal.jsx
import { useState } from "react";

const ROLES = ["UPI", "Admin", "User", "Manager", "Viewer"];

export default function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", active: true, role: "UPI" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: Date.now(),
      client: form.fullName,
      email: form.email,
      role: form.role,
      lastActive: "Today",
      status: form.active ? "Paid" : "Inactive",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-80 min-h-screen p-6 shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-900">Add User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {[
            { key: "fullName", label: "Full Name",      type: "text",  placeholder: "Enter full name"     },
            { key: "email",    label: "Email Address",  type: "email", placeholder: "Enter email address" },
            { key: "phone",    label: "Phone Number",   type: "tel",   placeholder: "Enter phone number"  },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                  ${errors[key]
                    ? "border-red-400 bg-red-50 focus:border-red-500"
                    : "border-gray-200 focus:border-yellow-400"}`}
              />
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          {/* Active User toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Active User</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer
                peer-checked:bg-yellow-400 after:content-[''] after:absolute after:top-0.5
                after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5
                after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>

          {/* Role dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         outline-none focus:border-yellow-400 bg-white appearance-none"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-lg text-sm font-semibold border-2 border-yellow-400
                       text-yellow-600 hover:bg-yellow-400 hover:text-black active:scale-95 transition-all"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}