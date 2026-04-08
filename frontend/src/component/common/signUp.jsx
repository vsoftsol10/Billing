import React, { useState } from 'react'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen flex font-sans">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .slide-up-1 { animation-delay: 0.05s; }
        .slide-up-2 { animation-delay: 0.15s; }
        .slide-up-3 { animation-delay: 0.25s; }
        .slide-up-4 { animation-delay: 0.35s; }
        .slide-up-5 { animation-delay: 0.45s; }
        .slide-up-6 { animation-delay: 0.55s; }
        .slide-up-7 { animation-delay: 0.65s; }

        @keyframes blobMove {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.05) translate(-10px, 10px); }
        }
        .blob { animation: blobMove 8s ease-in-out infinite alternate; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between relative w-[46%] bg-amber-400 p-10 overflow-hidden rounded-tr-[40%] rounded-br-3xl">

        {/* Decorative blobs */}
        <div className="blob absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-amber-300 opacity-60" />
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-amber-300 opacity-40" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" fill="#f5a623"/>
                <path d="M8 21h8M12 17v4" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display text-gray-900 text-lg font-bold tracking-tight">VBILL</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center">
          <h1 className="font-display text-3xl font-bold text-gray-900 leading-tight mb-4">
            Start Managing Your Business Smarter
          </h1>
          <p className="text-gray-800 text-sm leading-relaxed max-w-lg mx-auto">
            Join thousands of businesses already using VBILL to streamline billing, track sales, and grow with confidence.
          </p>

          {/* Feature Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {[
              { icon: '🚀', text: 'Quick Setup' },
              { icon: '📦', text: 'Inventory Management' },
              { icon: '💳', text: 'Easy Payments' },
            ].map((f) => (
              <div
                key={f.text}
                className="inline-flex items-center gap-2 bg-white backdrop-blur-sm rounded-xl px-3.5 py-2 whitespace-nowrap"
              >
                <span className="text-sm">{f.icon}</span>
                <span className="text-sm font-medium text-gray-900">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="relative z-10 text-xs text-gray-700 font-medium text-center">
          Trusted by 100+ businesses
        </p>
      </div>

      {/* Right Panel — Sign Up Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-10">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="slide-up slide-up-1 mb-8">
            <h2 className="font-display text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Set up your billing system in minutes</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">

            {/* Full Name */}
            <div className="slide-up slide-up-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="slide-up slide-up-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="slide-up slide-up-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Password
              </label>
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
                  placeholder="Create a password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="slide-up slide-up-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Confirm Password
              </label>
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
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="slide-up slide-up-6 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-display font-semibold text-sm py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login link */}
          <p className="slide-up slide-up-7 text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/" className="text-amber-500 hover:text-amber-600 font-semibold transition-colors">
              Login
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignUp