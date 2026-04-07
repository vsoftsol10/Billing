import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import EWayBillHeader from '../component/EWayBills/EWayBillHeader'
import EWayBillFilters from '../component/EWayBills/EWayBillFilters'
import EWayBillTable from '../component/EWayBills/EWayBillTable'

const EWayBills = () => {
  const [activeFilter, setActiveFilter]           = useState('All')
  const [searchQuery, setSearchQuery]             = useState('')
  const [sidebarActive, setSidebarActive]         = useState('EWayBills')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleConnect   = ()    => console.log('Connect to E-way Bills')
  const handleView      = (id)  => console.log(`View E-way Bill: ${id}`)
  const handleEdit      = (id)  => console.log(`Edit E-way Bill: ${id}`)
  const handleDelete    = (id)  => console.log(`Delete E-way Bill: ${id}`)

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
          title="E-Way Bills"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">

          <EWayBillHeader onConnect={handleConnect} />

          <EWayBillFilters
            onFilterChange={setActiveFilter}
            onSearchChange={setSearchQuery}
          />

          <EWayBillTable
            externalFilter={activeFilter}
            externalSearch={searchQuery}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </main>
      </div>
    </div>
  )
}

export default EWayBills