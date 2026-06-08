import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import TallySyncHeader from '../component/TallySync/TallySyncHeader'
import TallySyncFilters from '../component/TallySync/TallySyncFilters'
import TallySyncTable from '../component/TallySync/TallySyncTable'

const TallySync = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarActive, setSidebarActive] = useState('Tally Sync')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleAddNew = () => {
    console.log('Add New clicked')
  }

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

      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-52">
        {/* ── Navbar ── */}
        <Navbar
          title="Tally Sync"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          {/* Header */}
          <TallySyncHeader onAddNew={handleAddNew} />

          {/* Filters and Search */}
          <TallySyncFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Table */}
          <TallySyncTable />
        </main>
      </div>
    </div>
  )
}

export default TallySync
