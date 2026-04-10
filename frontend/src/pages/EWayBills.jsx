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

  const sampleEWayBills = [
    { id: 'EWB-001', client: 'Globe Inc',         amount: '₹ 8,750',  date: '2026-01-14', status: 'Pending'  },
    { id: 'EWB-002', client: 'Stark Industries',  amount: '₹ 4,550',  date: '2026-01-09', status: 'Success'  },
    { id: 'EWB-003', client: 'Soylent Corp',      amount: '₹ 2,950',  date: '2026-01-10', status: 'Success'  },
    { id: 'EWB-004', client: 'Wayne Enterprises', amount: '₹ 12,400', date: '2026-01-15', status: 'Failed'   },
    { id: 'EWB-005', client: 'Acme Corp',         amount: '₹ 5,300',  date: '2026-01-16', status: 'Pending'  },
    { id: 'EWB-006', client: 'Umbrella Ltd',      amount: '₹ 7,100',  date: '2026-01-17', status: 'Cancelled' },
    { id: 'EWB-007', client: 'Bright Solutions',  amount: '₹ 3,200',  date: '2026-01-18', status: 'Success'  },
  ]



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
          <div className="max-w-7xl mx-auto space-y-6">
            <EWayBillHeader onConnect={handleConnect} />

            <EWayBillFilters
              onFilterChange={setActiveFilter}
              onSearchChange={setSearchQuery}
            />


            <EWayBillTable
              data={sampleEWayBills}
              externalFilter={activeFilter}
              externalSearch={searchQuery}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default EWayBills