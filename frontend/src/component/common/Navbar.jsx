import React, { useState } from 'react'

const Navbar = ({ title = 'Dashboard', subtitle, user = 'VBILL' }) => {
  const [hasNotif, setHasNotif] = useState(true)

  return (
    <header className="flex items-center justify-between px-7 py-4 bg-white border-b border-gray-100">
      <div>
        <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5 tracking-widest uppercase font-medium">
            Welcome{' '}
            <span className="text-amber-500 font-bold">{user}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={() => setHasNotif(false)}
          className="relative w-9 h-9 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" />
          )}
        </button>

        {/* User Avatar */}
        <button className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-gray-900 hover:bg-amber-500 transition-colors">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Navbar