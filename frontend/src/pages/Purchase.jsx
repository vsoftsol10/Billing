import { useState } from "react";
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'

const tabs = ["All", "Pending", "Paid", "Cancelled", "Draft"];

const initialPurchases = [
  { id: 1019, vendor: "Globe Inc",        mode: "UPI", amount: 8750, date: "2026-01-14", status: "Pending" },
  { id: 1022, vendor: "Stark Industries", mode: "UPI", amount: 4550, date: "2026-01-09", status: "Open"    },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Open"    },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Update"  },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Update"  },
];

const statusStyles = {
  Pending:   "bg-orange-100 text-orange-500 border border-orange-300",
  Open:      "bg-green-100  text-green-600  border border-green-300",
  Update:    "bg-sky-100    text-sky-600    border border-sky-300",
  Paid:      "bg-green-100  text-green-700  border border-green-300",
  Cancelled: "bg-red-100    text-red-500    border border-red-300",
  Draft:     "bg-gray-100   text-gray-500   border border-gray-300",
};

function formatINR(n) {
  return "₹ " + n.toLocaleString("en-IN");
}

export default function Purchase() {
  const [activeTab, setActiveTab]               = useState("All");
  const [tableSearch, setTableSearch]           = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const filtered = initialPurchases.filter((p) => {
    const matchTab    = activeTab === "All" || p.status.toLowerCase() === activeTab.toLowerCase();
    const matchSearch = tableSearch === "" ||
      p.vendor.toLowerCase().includes(tableSearch.toLowerCase()) ||
      String(p.id).includes(tableSearch);
    return matchTab && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50/60">

      {/* Sidebar */}
      <Sidebar
        activeItem="Purchase"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar
          title="Purchase"
          subtitle="Manage your purchases and expenses"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5">

          {/* Page heading + CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-900 font-bold leading-tight">Keep track of all your purchases and expenses</h2>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl shadow transition-all">
              <span className="text-lg leading-none">+</span> Purchase
            </button>
          </div>

          {/* White card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Tabs + search row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-3">

              {/* Tabs */}
              <div className="flex gap-1 flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab
                        ? "bg-amber-400 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search + Filters */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-auto">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-200 w-full sm:w-40 bg-white"
                  />
                </div>
                <button className="flex items-center justify-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition bg-white w-full sm:w-auto">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
                    <line x1="11" y1="18" x2="13" y2="18"/>
                  </svg>
                  Filters
                </button>
              </div>

            </div>
            {/* END: Tabs + search row */}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "Vendor", "Mode", "Amount", "Date", "Status", "Action"].map((col) => (
                      <th key={col} className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                        No purchases found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors">

                        <td className="py-3.5 px-4 text-center text-gray-700 font-medium">{row.id}</td>

                        <td className="py-3.5 px-4 text-center text-gray-700">{row.vendor}</td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-md">
                            {row.mode}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center text-gray-700 font-semibold">
                          {formatINR(row.amount)}
                        </td>

                        <td className="py-3.5 px-4 text-center text-gray-500">{row.date}</td>

                        <td className="py-3.5 px-4 text-center">
                          <button className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg ${statusStyles[row.status] || "bg-gray-100 text-gray-500"}`}>
                            {row.status}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                            </svg>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="View">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* END: Table */}

          </div>
          {/* END: White card */}

        </main>
      </div>
      {/* END: Right side */}

    </div>
  );
}