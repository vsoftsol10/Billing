import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import GSTHeader from '../component/Gst/GSTHeader'
import GSTFilters from '../component/GST/GSTFilters'
import GSTStats from '../component/GST/GSTStats'
import GSTTable from '../component/Gst/GSTTable'    

const GST = () => {
  const [activeFilter, setActiveFilter]       = useState('All')
  const [searchQuery, setSearchQuery]         = useState('')
  const [sidebarActive, setSidebarActive]     = useState('GST')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const stats = {
    totalCollected: '3,25,000',
    inputTaxCredit: '1,80,000',
    totalFiled:     '3,25,000',
    pending:        15,
  }

  const handleCreateGST   = ()    => console.log('Create new GST')
  const handleEditGST     = (id)  => console.log(`Edit GST: ${id}`)
  const handleDeleteGST   = (id)  => console.log(`Delete GST: ${id}`)

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
          title="GST"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">

          <GSTHeader onCreateGST={handleCreateGST} />

          <GSTStats stats={stats} />

          {/* Uncomment to hide stats: */}
          {/* <GSTStats stats={stats} /> */}

          <GSTFilters
            onFilterChange={setActiveFilter}
            onSearchChange={setSearchQuery}
          />

          <GSTTable
            externalFilter={activeFilter}
            externalSearch={searchQuery}
            onEdit={handleEditGST}
            onDelete={handleDeleteGST}
          />

        </main>
      </div>
    </div>
  )
}

export default GST