import { useState } from "react";
import Navbar from '../component/common/Navbar'
import Sidebar from '../component/common/SideBar'
import PurchaseHeader from '../component/Purchase/PurchaseHeader';
import PurchaseCard from '../component/Purchase/PurchaseCard';
import { initialPurchases } from '../component/Purchase/purchaseConstants';

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

          <PurchaseHeader />

          <PurchaseCard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tableSearch={tableSearch}
            setTableSearch={setTableSearch}
            filtered={filtered}
          />

        </main>
      </div>
      {/* END: Right side */}

    </div>
  );
}