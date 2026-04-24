import { useState } from "react";
import Navbar from '../component/common/Navbar';
import Sidebar from '../component/common/SideBar';
import PurchaseHeader from '../component/Purchase/PurchaseHeader';
import PurchaseCard from '../component/Purchase/PurchaseCard';
import CreatePurchase from '../component/Purchase/CreatePurchase';
import { initialPurchases } from '../component/Purchase/purchaseConstants';

export default function Purchase() {
  const [activeTab, setActiveTab] = useState("All");
  const [tableSearch, setTableSearch] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [showCreate, setShowCreate] = useState(false); // ← new

  const filtered = purchases.filter((p) => {
    const matchTab = activeTab === "All" || p.status.toLowerCase() === activeTab.toLowerCase();
    const matchSearch = tableSearch === "" ||
      p.vendor.toLowerCase().includes(tableSearch.toLowerCase()) ||
      String(p.id).includes(tableSearch);
    return matchTab && matchSearch;
  });

  const handleUpdateStatus = (i, newStatus) =>
    setPurchases(prev => prev.map((row, idx) => idx === i ? { ...row, status: newStatus } : row));

  const handleUpdateMode = (i, newMode) =>
    setPurchases(prev => prev.map((row, idx) => idx === i ? { ...row, mode: newMode } : row));

  // ── Shared shell ────────────────────────────────────────────────────────────
  const Shell = ({ children }) => (
    <div className="flex min-h-screen bg-gray-50/60 overflow-hidden">
      <Sidebar
        activeItem="Purchase"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={showCreate ? "Create Purchase" : "Purchase"}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />
        {children}
      </div>
    </div>
  );

  // ── Create view ─────────────────────────────────────────────────────────────
  if (showCreate) {
    return (
      <Shell>
        <CreatePurchase
          onBack={() => setShowCreate(false)}
          onSave={(data) => {
            console.log("Saved purchase:", data);
            setShowCreate(false);
          }}
          onSaveDraft={(data) => {
            console.log("Draft purchase:", data);
            setShowCreate(false);
          }}
        />
      </Shell>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <Shell>
      <main className="flex-1 p-3 sm:p-5 lg:p-7 space-y-5 overflow-auto">
        <PurchaseHeader onAddPurchase={() => setShowCreate(true)} />
        <PurchaseCard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tableSearch={tableSearch}
          setTableSearch={setTableSearch}
          filtered={filtered}
          onUpdateStatus={handleUpdateStatus}
          onUpdateMode={handleUpdateMode}
        />
      </main>
    </Shell>
  );
}