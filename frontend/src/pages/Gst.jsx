import React, { useState } from 'react'
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import GSTStats from '../component/Gst/GSTStats'
import GSTChart from '../component/Gst/GSTChart'
import FilingStatus from '../component/Gst/FilingStatus'
import GSTR1Stats from '../component/Gst/GSTR1Stats'
import GSTR1Table from '../component/Gst/GSTR1Table'
import GSTR2Stats from '../component/Gst/GSTR2Stats'
import GSTR2Table from '../component/Gst/GSTR2Table'

const GST = () => {
  const [activeTab, setActiveTab] = useState('Overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarActive, setSidebarActive] = useState('GST')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const stats = {
    totalCollected: '3,25,000',
    inputTaxCredit: '1,80,000',
    totalFiled:     '3,25,000',
    pending:        15,
  }

  const handleCreateGST = () => console.log('Re-login clicked')

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
          title="GST"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">

          {/* Header with title and Re-login button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">GST</h1> */}
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">Manage your GST filings, taxes, and compliance</h2>
            </div>
            <button
              onClick={handleCreateGST}
              className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm whitespace-nowrap"
            >
              Re-login
            </button>
          </div>

          {/* Search Bar */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                />
              </div>
            </div>
          </div> */}

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {['Overview', 'GSTR-1', 'GSTR-2'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab
                    ? 'text-yellow-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"></div>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'Overview' && (
            <>
              {/* Stats */}
              <GSTStats stats={stats} />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <GSTChart />
                </div>
                <div className="lg:col-span-2">
                  <FilingStatus />
                </div>
              </div>
            </>
          )}

          {/* GSTR-1 Tab */}
          {activeTab === 'GSTR-1' && (
            <div>
              <GSTR1Stats />
              <GSTR1Table />
            </div>
          )}

          {/* GSTR-2 Tab */}
          {activeTab === 'GSTR-2' && (
            <div>
              <GSTR2Stats />
              <GSTR2Table />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default GST