import React, { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-amber-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Sora', sans-serif; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .slide-up-1 { animation-delay: 0.05s; }
        .slide-up-2 { animation-delay: 0.15s; }
        .slide-up-3 { animation-delay: 0.25s; }
        .slide-up-4 { animation-delay: 0.35s; }

        @keyframes blobMove {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.08) translate(-12px, 12px); }
        }
        .blob1 { animation: blobMove 9s ease-in-out infinite alternate; }

        @keyframes blobMove2 {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.06) translate(10px, -10px); }
        }
        .blob2 { animation: blobMove2 11s ease-in-out infinite alternate; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner { animation: spin 0.8s linear infinite; }

        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.85) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .success-pop { animation: successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .dot-pattern {
          background-image: radial-gradient(circle, #fcd34d 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* Background dot pattern */}
      <div className="dot-pattern absolute inset-0 opacity-40" />

      {/* Decorative blobs */}
      <div className="blob1 absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-300 opacity-50 blur-3xl" />
      <div className="blob2 absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-400 opacity-40 blur-3xl" />
      <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full bg-amber-200 opacity-60 blur-xl" />
      <div className="absolute bottom-20 left-1/4 w-14 h-14 rounded-full bg-amber-300 opacity-50 blur-lg" />

      {/* Logo — top center */}
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

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/60 border border-amber-100 p-8">

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="slide-up slide-up-1 mb-7">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900">Forgot Password?</h2>
                <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div className="slide-up slide-up-2">
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

                {/* Submit */}
                <div className="slide-up slide-up-3 pt-1">
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
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to login */}
              <div className="slide-up slide-up-4 text-center mt-6">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Login
                </a>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="success-pop text-center py-2">
              <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Check Your Inbox</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-amber-500 font-semibold text-sm mb-6">{email}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-8">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>

              <button
                onClick={() => { setIsSubmitted(false); setEmail('') }}
                className="w-full border border-gray-200 hover:border-amber-400 text-gray-700 hover:text-gray-900 font-display font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-amber-50 mb-4"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Try a different email
              </button>

              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Login
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ForgotPassword