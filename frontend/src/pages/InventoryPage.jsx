import { useState, useMemo } from "react";
import Navbar from "../component/common/Navbar";
import Sidebar from "../component/common/SideBar";
import InventoryHeader  from "../component/Inventory/InventoryHeader";
import InventoryStats   from "../component/Inventory/InventoryStats";
import InventoryFilters from "../component/Inventory/InventoryFilters";
import InventoryTable   from "../component/Inventory/InventoryTable";

const INITIAL_ITEMS = [
  { id: 1, name: "Globe Inc",        qty: "04", salesPrice: "₹ 8,750", purchasePrice: "₹ 8,750", date: "2026-01-14", status: "Pending" },
  { id: 2, name: "Stark Industries", qty: "13", salesPrice: "₹ 4,550", purchasePrice: "₹ 4,550", date: "2026-01-09", status: "Open"    },
  { id: 3, name: "Soylent Corp",     qty: "11", salesPrice: "₹ 2,950", purchasePrice: "₹ 2,950", date: "2026-01-10", status: "Open"    },
  { id: 4, name: "Soylent Corp",     qty: "26", salesPrice: "₹ 2,950", purchasePrice: "₹ 2,950", date: "2026-01-10", status: "Update"  },
  { id: 5, name: "Soylent Corp",     qty: "09", salesPrice: "₹ 2,950", purchasePrice: "₹ 2,950", date: "2026-01-10", status: "Update"  },
];

const STATUS_CYCLE = ["Pending", "Open", "Update"];

export default function InventoryPage() {
  const [items,        setItems]        = useState(INITIAL_ITEMS);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Derived filtered list
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  // Cycle status on badge click
  const handleStatusChange = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(item.status) + 1) % STATUS_CYCLE.length] }
          : item
      )
    );
  };

  const handleStockIn  = (id) => alert(`Stock In  → item #${id}`);
  const handleStockOut = (id) => alert(`Stock Out → item #${id}`);
  const handleAddNew   = ()  => alert("Open Add New modal");

  const [sidebarActive, setSidebarActive] = useState("Inventory");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar
          title="Inventory"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <InventoryHeader onAddNew={handleAddNew} />

            <InventoryStats />

            <InventoryFilters
              search={search}
              onSearch={setSearch}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
            />

            <InventoryTable
              items={filteredItems}
              onStatusChange={handleStatusChange}
              onStockIn={handleStockIn}
              onStockOut={handleStockOut}
            />
          </div>
        </main>
      </div>
    </div>
  );
}