import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_EMAIL = 'admin@vbill.com'
const DEFAULT_PASSWORD = 'vbill@123'
 
const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
 
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSubmitted, setForgotSubmitted] = useState(false)
  const navigate=useNavigate();
 
  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
        localStorage.setItem('token', 'dummy-token') // Set token on successful login
        navigate('/dashboard')
      } else {
        setError('Invalid email or password. Try admin@vbill.com / vbill@123')
      }
    }, 1200)
  }
 
  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setTimeout(() => { setForgotLoading(false); setForgotSubmitted(true) }, 1500)
  }
 
  const closeModal = () => {
    setShowForgotModal(false)
    setTimeout(() => { setForgotEmail(''); setForgotSubmitted(false); setForgotLoading(false) }, 300)
  }
 
  return (
    <div className="min-h-screen flex font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Sora', sans-serif; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .slide-up-1{animation-delay:.05s}.slide-up-2{animation-delay:.15s}.slide-up-3{animation-delay:.25s}
        .slide-up-4{animation-delay:.35s}.slide-up-5{animation-delay:.45s}.slide-up-6{animation-delay:.55s}
        @keyframes blobMove { from{transform:scale(1) translate(0,0)} to{transform:scale(1.05) translate(-10px,10px)} }
        .blob { animation: blobMove 8s ease-in-out infinite alternate; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes backdropIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .backdrop-in{animation:backdropIn 0.2s ease forwards}
        .modal-in{animation:modalIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards}
        @keyframes successPop { 0%{opacity:0;transform:scale(0.9) translateY(8px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        .success-pop{animation:successPop 0.4s cubic-bezier(0.16,1,0.3,1) forwards}
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .shake{animation:shake 0.4s ease}
      `}</style>
 
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between relative w-[46%] bg-amber-400 p-10 overflow-hidden rounded-tr-[40%] rounded-br-3xl">
        <div className="blob absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-amber-300 opacity-60" />
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-amber-300 opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#f59e0b"/>
              </svg>
            </div>
            <span className="font-display text-gray-900 text-lg font-bold tracking-tight">
              <span>V</span>consTech
            </span>
          </div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-display text-3xl font-bold text-gray-900 leading-tight mb-4">
            Power Your Business with Better Billing
          </h1>
          <p className="text-gray-800 text-sm leading-relaxed max-w-lg mx-auto">
            Simplify financial management, reduce manual work, and keep your billing process running smoothly from start to finish.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {['⚡ Fast Invoice Generation', '📊 Real-time Sales Tracking', '🔒 Secure & Reliable'].map(f => (
              <div key={f} className="inline-flex items-center gap-2 bg-white rounded-xl px-3.5 py-2">
                <span className="text-sm font-medium text-gray-900">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-gray-700 font-medium text-center">Trusted by 100+ businesses</p>
      </div>
 
      {/* Right Panel */}
      <div className="flex-1 bg-white flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          <div className="slide-up slide-up-1 mb-8">
            <h2 className="font-display text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">Secure access to your billing system</p>
          </div>
 
          {/* Demo hint */}
          <div className="slide-up slide-up-1 mb-5 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700">
            <span className="font-semibold">Demo:</span> admin@vbill.com / vbill@123
          </div>
 
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="slide-up slide-up-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                />
              </div>
            </div>
 
            <div className="slide-up slide-up-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div className="text-right mt-1.5">
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs text-amber-500 hover:text-amber-600 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
            </div>
 
            {error && (
              <div className="shake text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
                {error}
              </div>
            )}
 
            <div className="slide-up slide-up-5 pt-1">
              <button type="submit" disabled={isLoading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-display font-semibold text-sm py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading
                  ? <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/></svg> Signing in...</>
                  : <>Login <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>
            </div>
          </form>
 
          <p className="slide-up slide-up-6 text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-amber-500 hover:text-amber-600 font-semibold transition-colors">Sign up</a>
          </p>
        </div>
      </div>
 
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="backdrop-in fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="modal-in w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-7">
            {!forgotSubmitted ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <h3 className="font-display text-lg font-bold text-gray-900">Forgot Password?</h3>
                    <p className="text-gray-400 text-sm mt-0.5">We'll send a reset link to your email.</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-300 hover:text-gray-500 transition-colors mt-1 ml-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      </span>
                      <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@company.com" required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-300 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoading}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-display font-semibold text-sm py-3 rounded-xl disabled:opacity-70 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md"
                  >
                    {forgotLoading
                      ? <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/></svg> Sending...</>
                      : <>Send Reset Link <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    }
                  </button>
                </form>
              </>
            ) : (
              <div className="success-pop text-center py-2">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">Check your inbox</h3>
                <p className="text-gray-400 text-sm mb-1">Reset link sent to</p>
                <p className="text-amber-500 font-semibold text-sm mb-5">{forgotEmail}</p>
                <p className="text-gray-300 text-xs mb-6">Didn't get it? Check your spam folder.</p>
                <button onClick={closeModal} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-display font-semibold text-sm py-3 rounded-xl flex items-center justify-center transition-all">
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login