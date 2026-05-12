import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ── This page handles the link from the reset email ──────────
// Route: /reset-password?token=<token>
// Add to your router: <Route path="/reset-password" element={<ResetPassword />} />

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Reset failed. Please request a new link.')
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-amber-50">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .slide-up-1 { animation-delay: 0.05s; } .slide-up-2 { animation-delay: 0.15s; }
        .slide-up-3 { animation-delay: 0.25s; } .slide-up-4 { animation-delay: 0.35s; }
        @keyframes blobMove { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.08) translate(-12px, 12px); } }
        .blob1 { animation: blobMove 9s ease-in-out infinite alternate; }
        @keyframes blobMove2 { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.06) translate(10px, -10px); } }
        .blob2 { animation: blobMove2 11s ease-in-out infinite alternate; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes successPop { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .success-pop { animation: successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .shake { animation: shake 0.4s ease; }
        .dot-pattern { background-image: radial-gradient(circle, #fcd34d 1px, transparent 1px); background-size: 24px 24px; }
      `}</style>

      <div className="dot-pattern absolute inset-0 opacity-40" />
      <div className="blob1 absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-300 opacity-50 blur-3xl" />
      <div className="blob2 absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-400 opacity-40 blur-3xl" />

      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="14" rx="2" fill="#f5a623"/>
            <path d="M8 21h8M12 17v4" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-display text-gray-900 text-lg font-bold tracking-tight">VBILL</span>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/60 border border-amber-100 p-8">

          {success ? (
            <div className="success-pop text-center py-2">
              <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Your password has been updated successfully. Redirecting you to login...
              </p>
              <div className="flex justify-center">
                <svg className="spinner w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          ) : (
            <>
              <div className="slide-up slide-up-1 mb-7">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900">Set New Password</h2>
                <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="slide-up slide-up-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">New Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      disabled={!token}
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white disabled:opacity-50"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="slide-up slide-up-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      disabled={!token}
                      className={`w-full pl-10 pr-11 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white disabled:opacity-50 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20'
                          : 'border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirmPassword
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-rose-500 mt-1.5">Passwords don't match</p>
                  )}
                </div>

                {error && (
                  <div className="shake text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
                    {error}
                  </div>
                )}

                <div className="slide-up slide-up-4 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || !token || (confirmPassword && password !== confirmPassword)}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-display font-semibold text-sm py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/></svg> Resetting...</>
                    ) : (
                      <>Reset Password <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6">
                <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Login
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword