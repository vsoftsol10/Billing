// Quotation.jsx
import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import QuotationHeader from '../component/Quotation/QuotationHeader'
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

  return (
    // Use `overflow-hidden` on root so sidebar overlay never causes horizontal scroll
    <div className="flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* This div must be `min-w-0` so flex children can shrink below their content size */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title="Quotation"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-3 sm:p-5 lg:p-7 overflow-auto min-w-0">
          <QuotationHeader onCreateQuotation={() => {}} />
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
      </div>
    </div>
  )
}

export default Quotation