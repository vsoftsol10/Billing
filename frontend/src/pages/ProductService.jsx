// pages/ProductService.jsx
import { useState } from "react";
import Navbar from "../component/common/Navbar";
import Sidebar from "../component/common/SideBar";
import ProductHeader from "../component/ProductService/ProductHeader";
import ProductTabs from "../component/ProductService/ProductTabs";
import ProductFilters from "../component/ProductService/ProductFilters";
import ProductStats from "../component/ProductService/ProductStats";
import ProductTable from "../component/ProductService/ProductTable";

const INITIAL_ITEMS = [
  { name: "Globe Inc", qty: 1019, mrp: 8750, sellingPrice: "2026-01-14", taxableAmount: "2026-01-14", costPrice: 21950 },
  { name: "Stark Industries", qty: 1022, mrp: 4550, sellingPrice: "2026-01-09", taxableAmount: "2026-01-09", costPrice: 4950 },
  { name: "Soylent Corp", qty: 1009, mrp: 2950, sellingPrice: "2026-01-10", taxableAmount: "2026-01-10", costPrice: 2950 },
  { name: "Soylent Corp", qty: 1009, mrp: 2950, sellingPrice: "2026-01-10", taxableAmount: "2026-01-10", costPrice: 20000 },
  { name: "Soylent Corp", qty: 1009, mrp: 2950, sellingPrice: "2026-01-10", taxableAmount: "2026-01-10", costPrice: 2950 },
];

const ProductService = () => {
  const [activeTab, setActiveTab] = useState("Items");
  const [search, setSearch] = useState("");
  const [items] = useState(INITIAL_ITEMS);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const [sidebarActive, setSidebarActive] = useState("Product & Service");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleAddNew = () => alert("Add new product or service");

  return (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">
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
          title="Product & Service"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <ProductHeader onAddNew={handleAddNew} />

          <ProductStats items={items} />

          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <ProductFilters
            onSearch={setSearch}
            onFilter={() => alert("Filters clicked")}
          />

          <ProductTable
            items={filtered}
            onView={(item) => alert(`View: ${item.name}`)}
            onEdit={(item) => alert(`Edit: ${item.name}`)}
            onDelete={(item) => alert(`Delete: ${item.name}`)}
          />

          <p className="text-xs text-gray-400 mt-3 text-right">
            Showing {filtered.length} of {items.length} items
          </p>
        </main>
      </div>
    </div>
  );
};

export default ProductService;