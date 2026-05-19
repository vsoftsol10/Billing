import { useState, useEffect } from "react";
import { fetchProducts } from "../api/productService";
import Navbar from "../component/common/Navbar";
import Sidebar from "../component/common/SideBar";
import ProductHeader from "../component/ProductService/ProductHeader";
import ProductTabs from "../component/ProductService/ProductTabs";
import ProductStats from "../component/ProductService/ProductStats";
import ProductTable from "../component/ProductService/ProductTable";
import AddNewClientModal from "../component/ProductService/AddNewClientModal";
import ViewProductModal from "../component/ProductService/ViewProductModal";   // ← add
import EditProductModal from "../component/ProductService/EditProductModal";   // ← add

const ProductService = () => {
  const [activeTab,         setActiveTab]         = useState("Items");
  const [search,            setSearch]            = useState("");
  const [items,             setItems]             = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [showModal,         setShowModal]         = useState(false);
  const [viewItem,          setViewItem]          = useState(null);   // ← add
  const [editItem,          setEditItem]          = useState(null);   // ← add
  const [sidebarActive,     setSidebarActive]     = useState("Product & Service");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const businessId = import.meta.env.VITE_BUSINESS_ID;

  useEffect(() => {
    fetchProducts({ businessId })
      .then(res => {
        setItems(res.data.map(p => ({
          id:            p.id,
          name:          p.name,
          qty:           p.stockQuantity,
          mrp:           parseFloat(p.sellingPrice),
          sellingPrice:  `₹ ${parseFloat(p.sellingPrice).toLocaleString("en-IN")}`,
          taxableAmount: `${p.taxPercent}%`,
          costPrice:     parseFloat(p.costPrice ?? 0),
          unit:          p.unit,
          description:   p.description,
          hsnCode:       p.hsnCode,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = (newItem) => {
    setItems(prev => [...prev, {
      id:            newItem.id,
      name:          newItem.name,
      qty:           newItem.stockQuantity,
      mrp:           parseFloat(newItem.sellingPrice),
      sellingPrice:  `₹ ${parseFloat(newItem.sellingPrice).toLocaleString("en-IN")}`,
      taxableAmount: `${newItem.taxPercent}%`,
      costPrice:     parseFloat(newItem.costPrice ?? 0),
      unit:          newItem.unit,
      description:   newItem.description,
      hsnCode:       newItem.hsnCode,
    }]);
  };

  // ── Update item in list after edit ───────────────────────────────────────
  const handleUpdateProduct = (updatedItem) => {
    setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar
        activeItem={sidebarActive}
        onNavigate={setSidebarActive}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar
          title="Product & Service"
          subtitle={true}
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto min-w-0">
          <ProductHeader onAddNew={() => setShowModal(true)} />
          <ProductStats items={items} />
          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
              Loading products...
            </div>
          ) : (
            <ProductTable
              items={filtered}
              onView={(item) => setViewItem(item)}    // ← wire up
              onEdit={(item) => setEditItem(item)}    // ← wire up
              onDelete={(item) => alert(`Delete: ${item.name}`)}
            />
          )}

          <p className="text-xs text-gray-400 mt-3 text-right">
            Showing {filtered.length} of {items.length} items
          </p>
        </main>
      </div>

      {showModal && (
        <AddNewClientModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {/* ── View modal ── */}
      {viewItem && (
        <ViewProductModal
          item={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}

      {/* ── Edit modal ── */}
      {editItem && (
        <EditProductModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default ProductService;