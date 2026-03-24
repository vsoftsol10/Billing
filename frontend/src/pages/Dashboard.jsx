import React from 'react'
import StatCards from '../component/Dashboard/StatsCard'
import RevenueChart from '../component/Dashboard/RevenueChart'
import RecentTransactions from '../component/Dashboard/RecentTransaction'
import Sidebar from '../component/common/SideBar'
import Navbar from '../component/common/Navbar'

const DashboardPage = ({ user = 'VBILL' }) => {
  return (
    <div className="flex min-h-screen bg-gray-50/60">
      {/* Sidebar sits here, as a flex sibling */}
      <Sidebar activeItem="Dashboard" />

      {/* Right side: topbar + content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar title="Dashboard" subtitle user={user} />
        <main className="flex-1 p-6 space-y-5">
          <StatCards />
          <RevenueChart />
          <RecentTransactions />
        </main>
      </div>
    </div>
  )
}

export default DashboardPage