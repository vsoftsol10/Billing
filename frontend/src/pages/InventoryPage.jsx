// InventoryPage.jsx  — updated to use real API
import { useState, useMemo, useEffect, useCallback } from "react";
import Navbar           from "../component/common/Navbar";
import Sidebar          from "../component/common/SideBar";
import InventoryHeader  from "../component/Inventory/InventoryHeader";
import InventoryStats   from "../component/Inventory/InventoryStats";
import InventoryFilters from "../component/Inventory/InventoryFilters";
import InventoryTable   from "../component/Inventory/InventoryTable";
import StockModal       from "../component/Inventory/StockModal";

import {
  fetchInventory,
  fetchInventoryStats,
  fetchCategories,
  createProduct,
  stockIn,
  stockOut,
} from "../api/inventoryService";

export default function InventoryPage() {
  // ── UI state ──────────────────────────────────────────────
  const [search,            setSearch]            = useState("");
  const [statusFilter,      setStatusFilter]      = useState("All");
  const [showStockModal,    setShowStockModal]    = useState(false);
  const [sidebarActive,     setSidebarActive]     = useState("Inventory");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Data state ────────────────────────────────────────────
  const [items,      setItems]      = useState([]);
  const [stats,      setStats]      = useState(null);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Fetch inventory list ──────────────────────────────────
  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchInventory({
        search:  search || undefined,
        status:  statusFilter !== "All" ? statusFilter : undefined,
        page:    pagination.page,
        limit:   20,
      });
      setItems(res.data);
      setPagination((p) => ({ ...p, totalPages: res.pagination.totalPages }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, pagination.page]);

  // ── Fetch stats ───────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchInventoryStats();
      setStats(res.data);
    } catch (err) {
      console.error("Stats failed:", err.message);
    }
  }, []);

  // ── Fetch categories for StockModal ──────────────────────
  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Categories failed:", err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    loadStats();
    loadCategories();
  }, [loadStats, loadCategories]);

  // ── Debounce search ───────────────────────────────────────
  // Reset to page 1 whenever search/filter changes
  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [search, statusFilter]);

  // ── Handlers ─────────────────────────────────────────────

  // StockModal submit → POST /api/inventory
  const handleAddStock = async (formData) => {
  try {
    await createProduct({
      name:          formData.name,           // ← now a dedicated field
      categoryId:    formData.categoryId,
      unit:          formData.quantityUnit,
      sellingPrice:  Number(formData.stockValue),
      costPrice:     formData.purchase ? Number(formData.purchase) : undefined,
      stockQuantity: Number(formData.quantityValue),
    });
    setShowStockModal(false);
    loadInventory();
    loadStats();
  } catch (err) {
    alert(`Failed to add product: ${err.message}`);
  }
};

  // "Stock In" button → POST /api/inventory/:id/stock-in
  const handleStockIn = async (id) => {
    const qty = prompt("Enter quantity to add:");
    if (!qty || isNaN(Number(qty))) return;
    try {
      await stockIn(id, { quantity: Number(qty) });
      loadInventory();
      loadStats();
    } catch (err) {
      alert(`Stock in failed: ${err.message}`);
    }
  };

  // "Stock Out" button → POST /api/inventory/:id/stock-out
  const handleStockOut = async (id) => {
    const qty = prompt("Enter quantity to remove:");
    if (!qty || isNaN(Number(qty))) return;
    try {
      await stockOut(id, { quantity: Number(qty) });
      loadInventory();
      loadStats();
    } catch (err) {
      alert(`Stock out failed: ${err.message}`);
    }
  };

  // Status badge click — optimistic UI update (no separate API needed;
  // status is derived from stock quantity on the server)
  const handleStatusChange = (id) => {
    // For a real cycle you'd open an edit modal; here we just
    // show a placeholder until you build that flow
    console.info("Status change clicked for product", id);
  };

  return (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden font-sans">
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

      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-52">
        <Navbar
          title="Inventory"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <InventoryHeader onAddNew={() => setShowStockModal(true)} />

            {/* Pass live stats; InventoryStats falls back to its own
                hardcoded values when stats is null (first load) */}
            <InventoryStats stats={stats} />

            <InventoryFilters
              search={search}
              onSearch={setSearch}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <InventoryTable
              items={items}
              loading={loading}
              onStatusChange={handleStatusChange}
              onStockIn={handleStockIn}
              onStockOut={handleStockOut}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl
                             disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl
                             disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {showStockModal && (
        <StockModal
          categories={categories}           // pass real categories
          onClose={() => setShowStockModal(false)}
          onAdd={handleAddStock}
        />
      )}
    </div>
  );
}