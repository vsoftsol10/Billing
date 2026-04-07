import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import QuotationHeader from '../component/Quotation/QuotationHeader'
import QuotationTabs from '../component/Quotation/QuotationTabs'
import QuotationFilters from '../component/Quotation/QuotationFilters'
import QuotationTable, { DUMMY_QUOTATIONS } from '../component/Quotation/QuotationTable'

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

  const handleCreateQuotation = () => {
    console.log('Create new quotation')
    // TODO: open a create modal
  }

  const handleStatusChange = (id, newStatus) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSearchText = (text) => {
    setSearchText(text)
    setCurrentPage(1)
  }

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame)
    setCurrentPage(1)
    if (frame === 'All') {
      setSelectedYear('')
      setSelectedMonth('')
    }
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    setCurrentPage(1)
  }

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
    setCurrentPage(1)
  }

  const clearTimeFilters = () => {
    setTimeFrame('All')
    setSelectedYear('')
    setSelectedMonth('')
    setCurrentPage(1)
  }

  const handleView = (quote) => {
    console.log('View quotation', quote)
  }

  const handleEdit = (quote) => {
    console.log('Edit quotation', quote)
  }

  const handleDelete = (quote) => {
    setQuotations(prev => prev.filter(q => q.id !== quote.id))
  }

  return (
    /*
     * KEY FIX: Use `relative overflow-hidden` on the root so the sidebar
     * overlay never causes horizontal scroll / content shift on mobile.
     */
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Mobile backdrop — closes sidebar on outside tap ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/*
       * KEY FIX: `min-w-0 w-full` prevents the main column from ever
       * overflowing its flex container, which was causing the left-clip.
       */}
      <div className="flex-1 flex flex-col min-w-0 w-full">

        {/* Navbar */}
        <Navbar
          title="Quotation"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* Page content — px-4 on mobile, more on larger screens */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <div className="max-w-7xl mx-auto space-y-6">
            <QuotationHeader onCreateQuotation={handleCreateQuotation} />

            <QuotationFilters
              activeFilter={activeTab}
              onFilterChange={(filter) => { setActiveTab(filter); setCurrentPage(1) }}
              searchText={searchText}
              onSearchChange={handleSearchText}
              timeFrame={timeFrame}
              onTimeFrameChange={handleTimeFrameChange}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
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

export default Quotation
