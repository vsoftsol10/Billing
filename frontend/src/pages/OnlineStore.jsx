import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import OnlineStoreHeader from '../component/OnlineStore/OnlineStoreHeader'
import OnlineStoreQR from '../component/OnlineStore/OnlineStoreQR'

const OnlineStore = () => {
  const [sidebarActive, setSidebarActive]         = useState('OnlineStore')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Replace with your actual store URL
  const storeUrl = 'https://mystore.vbill.in'

  const handleAddNew = () => console.log('Add new product')

  return (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Mobile backdrop ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 w-full">

        {/* ── Navbar ── */}
        <Navbar
          title="Online Store"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <OnlineStoreHeader onAddNew={handleAddNew} />
          <OnlineStoreQR storeUrl={storeUrl} />
        </main>

      </div>
    </div>
  )
}

export default OnlineStore