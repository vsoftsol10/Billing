// components/EWayBills/EWayBillConnectModal.jsx
import { useState } from "react";

const STEPS = ["Add GSP Details", "E-Way Bills GSP Login", "Done"];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((label, idx) => {
        const stepNum  = idx + 1;
        const done     = stepNum < currentStep;
        const active   = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${done   ? "bg-amber-400 text-white"
                : active ? "bg-amber-400 text-white"
                :          "bg-gray-200 text-gray-500"}`}>
                {done
                  ? <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  : stepNum}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap
                ${active || done ? "text-gray-800" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div className={`h-px w-6 mx-1 shrink-0 ${done ? "bg-amber-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function EWayBillConnectModal({ onClose }) {
  const [step, setStep]         = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});

  const validateStep2 = () => {
    const e = {};
    if (!username.trim()) e.username = "Username is required";
    if (!password.trim()) e.password = "Password is required";
    return e;
  };

  const handleProceed = () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) {
      const e = validateStep2();
      if (Object.keys(e).length) { setErrors(e); return; }
      setStep(3);
    }
  };

  const inputCls = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
    ${errors[key]
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-gray-200 focus:border-amber-400 bg-white"}`;

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-96 h-full flex flex-col shadow-2xl"
        style={{ animation: "slideIn 0.22s ease" }}
      >
        <style>{`@keyframes slideIn { from { transform:translateX(40px); opacity:0; } to { transform:translateX(0); opacity:1; } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-sm font-bold text-gray-900">Connect to E-way Bill Portal</h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* Section label */}
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            E-way Bill GSP Login
          </p>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="space-y-4 text-sm text-gray-700">
              <p className="leading-relaxed">
                Follow below steps to register{" "}
                <span className="font-semibold">Tera Software Limited</span> as your GST Suvidha
                Provider (GSP) on <span className="font-semibold">E-way Bill Portal</span>
              </p>

              <div>
                <p className="font-bold text-gray-800 mb-2">STEP - 1</p>
                <ol className="space-y-2 text-gray-600 list-none">
                  <li>1. Login to the{" "}
                    <a href="#" className="text-blue-500 hover:underline font-medium">
                      E-way Bill Portal
                    </a>
                  </li>
                  <li>2. Click on <span className="font-semibold">Registration</span> in the left menu and select{" "}
                    <span className="font-semibold">For GSP</span>
                  </li>
                  <li>3. Click Send OTP</li>
                  <li>4. Verify OTP</li>
                </ol>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-2">STEP - 2</p>
                <ol className="space-y-2 text-gray-600 list-none">
                  <li>1. Login to the <span className="font-semibold">Add/New Button</span></li>
                  <li>2. Click on <span className="font-semibold">Tera Software Limited</span> in the GSP Name dropdown</li>
                  <li>3. Enter 3 letter Suffix ID and a password</li>
                  <li>4. Re-enter the User Name and Password and <span className="font-semibold">Click ADD</span></li>
                </ol>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Enter GSP Username and Password from the E-way Bill Portal
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  GSP Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="GSP Username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors(er => ({ ...er, username: "" })); }}
                  className={inputCls("username")}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  GSP Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="GSP Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(er => ({ ...er, password: "" })); }}
                    className={`${inputCls("password")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass
                      ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                          <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      : <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
                        </svg>
                    }
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          )}

          {/* ── Step 3 / Done ── */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-base font-bold text-gray-900">Successfully Connected!</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your GSP credentials have been verified. You can now generate E-way Bills.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-400
                           hover:bg-amber-500 text-gray-900 active:scale-95 transition-all"
              >
                Start Generating
              </button>
            </div>
          )}
        </div>

        {/* Footer buttons — hidden on step 3 */}
        {step < 3 && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                           border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Go Back
              </button>
            )}
            <button
              onClick={handleProceed}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                         bg-amber-400 hover:bg-amber-500 text-gray-900 active:scale-95 transition-all"
            >
              {step === 1 ? "Proceed to E-way Bill GSP Login" : "Proceed to Generate E-way Bill"}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}