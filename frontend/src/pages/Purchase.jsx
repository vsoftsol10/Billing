import { useState, useEffect, useCallback } from "react";
import Navbar from '../component/common/Navbar';
import Sidebar from '../component/common/SideBar';
import PurchaseHeader from '../component/Purchase/PurchaseHeader';
import PurchaseCard from '../component/Purchase/PurchaseCard';
import CreatePurchase from '../component/Purchase/CreatePurchase';
import {
  fetchPurchases,
  createPurchase,
  savePurchaseDraft,
  updatePurchaseStatus,
  updatePurchaseMode,
  deletePurchase,
} from '../api/purchaseService';

// ── TODO: replace with your real auth context ─────────────────────────────────
const BUSINESS_ID   = import.meta.env.VITE_BUSINESS_ID;
const CREATED_BY_ID = import.meta.env.VITE_USER_ID;
// ─────────────────────────────────────────────────────────────────────────────

export default function Purchase() {
  const [activeTab, setActiveTab]           = useState("All");
  const [tableSearch, setTableSearch]       = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [purchases, setPurchases]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [showCreate, setShowCreate]         = useState(false);
  const [saving, setSaving]                 = useState(false);

  // ── Fetch purchases from API ────────────────────────────────────────────────
  const loadPurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPurchases({
        businessId: BUSINESS_ID,
        status:     activeTab,
        search:     tableSearch,
      });
      // Normalize API response → shape PurchaseTable expects
      const normalized = res.data.map((p) => ({
        id:     p.purchaseNumber,
        _id:    p.id,                                         // real UUID for PATCH/DELETE
        vendor: p.supplier?.name || "—",
        mode: normalizeMode(p.payment_mode),
        amount: Number(p.totalAmount),
        date:   p.purchaseDate?.split("T")[0] ?? "",
        status: capitalize(p.status),
      }));
      setPurchases(normalized);
    } catch (err) {
      setError("Failed to load purchases. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, tableSearch]);

  useEffect(() => {
    const timer = setTimeout(loadPurchases, tableSearch ? 400 : 0); // debounce search
    return () => clearTimeout(timer);
  }, [loadPurchases]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const normalizeMode = (mode = "") => {
    const map = {
      UPI: "UPI", CASH: "Cash", CARD: "Card",
      BANK_TRANSFER: "Net Banking", CHEQUE: "Cheque",
    };
    return map[mode.toUpperCase()] ?? mode;
  };

  const capitalize = (s = "") =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  // ── Save purchase ────────────────────────────────────────────────────────────
  const handleSave = async (data) => {
    try {
      setSaving(true);
      await createPurchase({
        businessId:  BUSINESS_ID,
        createdById: CREATED_BY_ID,
        vendor:      data.vendor,
        items:       data.items,
        note:        data.note,
        terms:       data.terms,
        purchaseDate: data.date,
        status:      "PENDING",
      });
      setShowCreate(false);
      loadPurchases();
    } catch (err) {
      alert("Failed to save purchase. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Save draft ───────────────────────────────────────────────────────────────
  const handleSaveDraft = async (data) => {
    try {
      setSaving(true);
      await savePurchaseDraft({
        businessId:  BUSINESS_ID,
        createdById: CREATED_BY_ID,
        vendor:      data.vendor,
        items:       data.items,
        note:        data.note,
        terms:       data.terms,
        purchaseDate: data.date,
      });
      setShowCreate(false);
      loadPurchases();
    } catch (err) {
      alert("Failed to save draft. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Inline status update (PurchaseTable dropdown) ────────────────────────────
  const handleUpdateStatus = async (i, newStatus) => {
    const row = purchases[i];
    // Optimistic update
    setPurchases(prev =>
      prev.map((p, idx) => idx === i ? { ...p, status: newStatus } : p)
    );
    try {
      await updatePurchaseStatus(row._id, newStatus.toUpperCase());
    } catch (err) {
      console.error(err);
      loadPurchases(); // revert on failure
    }
  };

  // ── Inline mode update (PurchaseTable dropdown) ───────────────────────────────
  const handleUpdateMode = async (i, newMode) => {
    const row = purchases[i];
    // Optimistic update
    setPurchases(prev =>
      prev.map((p, idx) => idx === i ? { ...p, mode: newMode } : p)
    );
    try {
      await updatePurchaseMode(row._id, newMode);
    } catch (err) {
      console.error(err);
      loadPurchases(); // revert on failure
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async (i) => {
    const row = purchases[i];
    if (!window.confirm(`Delete purchase ${row.id}?`)) return;
    setPurchases(prev => prev.filter((_, idx) => idx !== i)); // optimistic
    try {
      await deletePurchase(row._id);
    } catch (err) {
      console.error(err);
      loadPurchases(); // revert on failure
    }
  };

  // ── Shell ─────────────────────────────────────────────────────────────────────
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
      <div className="flex-1 flex flex-col min-w-0 lg:ml-52">
        <Navbar
          title={showCreate ? "Create Purchase" : "Purchase"}
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />
        {children}
      </div>
    </div>
  );

  // ── Create view ───────────────────────────────────────────────────────────────
  if (showCreate) {
    return (
      <Shell>
        <CreatePurchase
          saving={saving}
          onBack={() => setShowCreate(false)}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
        />
      </Shell>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────────
  return (
    <Shell>
      <main className="flex-1 p-3 sm:p-5 lg:p-7 space-y-5 overflow-auto">
        <PurchaseHeader onAddPurchase={() => setShowCreate(true)} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
            <button onClick={loadPurchases} className="ml-3 underline font-medium">Retry</button>
          </div>
        )}

        <PurchaseCard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tableSearch={tableSearch}
          setTableSearch={setTableSearch}
          filtered={purchases}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          onUpdateMode={handleUpdateMode}
          onDelete={handleDelete}
          onRefresh={loadPurchases}
        />
      </main>
    </Shell>
  );
}