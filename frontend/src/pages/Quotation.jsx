import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import QuotationHeader from '../component/Quotation/QuotationHeader'
import QuotationFilters from '../component/Quotation/QuotationFilters'
import QuotationTable, { DUMMY_QUOTATIONS } from '../component/Quotation/QuotationTable'
import CreateQuotation from '../component/Quotation/CreateQuotation'

const Quotation = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [searchText, setSearchText] = useState('')
  const [sidebarActive, setSidebarActive] = useState('Quotation')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [timeFrame, setTimeFrame] = useState('All')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [quotations, setQuotations] = useState(DUMMY_QUOTATIONS)
  const [showCreate, setShowCreate] = useState(false)   // ← new

  const handleStatusChange = (id, newStatus) =>
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame)
    setCurrentPage(1)
    if (frame === 'All') { setSelectedYear(''); setSelectedMonth('') }
  }

  const clearTimeFilters = () => {
    setTimeFrame('All'); setSelectedYear(''); setSelectedMonth(''); setCurrentPage(1)
  }

  // Shared layout shell (sidebar + mobile overlay)
  const Shell = ({ children }) => (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-auto">
        {children}
      </div>
    </div>
  )

  // ── Create view ──────────────────────────────────────────────────────────────
  if (showCreate) {
    return (
      <Shell>
        <CreateQuotation
          onBack={() => setShowCreate(false)}
          onSave={(data) => {
            console.log('Saved quotation:', data)
            setShowCreate(false)
          }}
          onSaveDraft={(data) => {
            console.log('Draft quotation:', data)
            setShowCreate(false)
          }}
        />
      </Shell>
    )
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <Shell>
      <Navbar
        title="Quotation"
        subtitle={true}
        user="VBILL"
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <main className="flex-1 p-3 sm:p-5 lg:p-7 overflow-auto min-w-0">
        {/* Pass onCreateQuotation so the header button can trigger the create view */}
        <QuotationHeader onCreateQuotation={() => setShowCreate(true)} />
        <QuotationFilters
          activeFilter={activeTab}
          onFilterChange={(filter) => { setActiveTab(filter); setCurrentPage(1) }}
          searchText={searchText}
          onSearchChange={(text) => { setSearchText(text); setCurrentPage(1) }}
          timeFrame={timeFrame}
          onTimeFrameChange={handleTimeFrameChange}
          selectedYear={selectedYear}
          onYearChange={(year) => { setSelectedYear(year); setCurrentPage(1) }}
          selectedMonth={selectedMonth}
          onMonthChange={(month) => { setSelectedMonth(month); setCurrentPage(1) }}
          onClearTimeFilters={clearTimeFilters}
        />
        <QuotationTable
          quotations={quotations}
          activeTab={activeTab}
          searchText={searchText}
          timeFrame={timeFrame}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onStatusChange={handleStatusChange}
          onView={(q) => console.log('view', q)}
          onEdit={(q) => console.log('edit', q)}
          onDelete={(q) => setQuotations(prev => prev.filter(x => x.id !== q.id))}
        />
      </main>
    </Shell>
  )
}

export default Quotation