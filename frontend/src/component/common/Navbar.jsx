import React, { useState, useRef, useEffect } from 'react'

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const Navbar = ({ title = 'Dashboard', subtitle, user = 'VBILL', onMenuToggle }) => {
  const [hasNotif, setHasNotif] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-7 py-3 sm:py-4 bg-white border-b border-gray-100 gap-3">

      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile/tablet only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex-shrink-0 w-9 h-9 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 tracking-widest uppercase font-medium truncate">
              Welcome{' '}
              <span className="text-amber-500 font-bold">{user}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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

        {/* User Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-gray-900 hover:bg-amber-500 transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden z-50"
              style={{ animation: 'fadeSlideDown 0.15s ease' }}
            >
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-900">{user}</p>
                <p className="text-xs text-gray-400 mt-0.5">Signed in</p>
              </div>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                Profile
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}

export default Navbar