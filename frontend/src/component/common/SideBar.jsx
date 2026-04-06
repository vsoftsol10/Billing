import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = [
  {
    label: 'Dashboard',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Sales',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    children: [
      {
        label: 'Invoice',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
        ),
      },
      {
        label: 'Quotation',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Purchase',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    label: 'GST',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    label: 'Online Store',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'E-way Bills',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: 'Tally Sync',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
  },
  {
    label: 'Product & Service',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: 'Inventory',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
  },
  {
    label: 'Invite User',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
  },
]

const ChevronIcon = ({ open }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: 'transform 0.2s ease',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const routeMap = {
  'Dashboard': '/dashboard',
  'Sales': '/sales',
  'Invoice': '/invoice',
  'Quotation': '/quotation',
  'Purchase': '/purchase',
  'GST': '/gst',
  'Online Store': '/online-store',
  'E-way Bills': '/eway-bills',
  'Tally Sync': '/tally-sync',
  'Product & Service': '/product-service',
  'Inventory': '/inventory',
  'Invite User': '/invite-user',
}

const Sidebar = ({ activeItem = 'Dashboard', onNavigate }) => {
  const navigate = useNavigate()
  // Auto-open Sales dropdown if a child is active
  const salesChildren = ['Invoice', 'Quotation']
  const [openDropdowns, setOpenDropdowns] = useState(() =>
    salesChildren.includes(activeItem) ? { Sales: true } : {}
  )

  const handleNavigation = (label) => {
    onNavigate && onNavigate(label)
    if (routeMap[label]) navigate(routeMap[label])
  }

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-52 min-h-screen bg-white border-r border-gray-100 flex flex-col py-4 shrink-0">
      {/* Logo */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white"/>
            </svg>
          </div>
          <span
            style={{ fontFamily: 'Sora, sans-serif' }}
            className="text-base font-bold text-gray-900 tracking-tight"
          >
            <span className="text-amber-500">V</span>Bill
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0
          const isOpen = !!openDropdowns[item.label]
          const isActive = activeItem === item.label
          // Parent is "active-styled" if it's directly active OR a child is active
          const isParentHighlighted =
            isActive || (hasChildren && item.children.some((c) => c.label === activeItem))

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleDropdown(item.label)
                  } else {
                    handleNavigation(item.label)
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                  ${isParentHighlighted
                    ? 'bg-amber-400 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
              >
                <span className={isParentHighlighted ? 'text-gray-900' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {hasChildren && (
                  <span className={isParentHighlighted ? 'text-gray-700' : 'text-gray-400'}>
                    <ChevronIcon open={isOpen} />
                  </span>
                )}
              </button>

              {/* Children */}
              {hasChildren && isOpen && (
                <div className="mt-0.5 ml-3 pl-3 border-l-2 border-amber-200 space-y-0.5">
                  {item.children.map((child) => {
                    const isChildActive = activeItem === child.label
                    return (
                      <button
                        key={child.label}
                        onClick={() => handleNavigation(child.label)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left
                          ${isChildActive
                            ? 'bg-amber-100 text-amber-800'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                          }`}
                      >
                        <span className={isChildActive ? 'text-amber-600' : 'text-gray-400'}>
                          {child.icon}
                        </span>
                        {child.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar