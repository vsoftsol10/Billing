import PurchaseTabs from './PurchaseTabs';
import PurchaseSearch from './PurchaseSearch';
import PurchaseTable from './PurchaseTable';

export default function PurchaseCard({
  activeTab, setActiveTab,
  tableSearch, setTableSearch,
  filtered, loading,
  onUpdateStatus, onUpdateMode, onDelete,
  onRefresh,   // ← add this
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
        <PurchaseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <PurchaseSearch tableSearch={tableSearch} setTableSearch={setTableSearch} />
      </div>

      <PurchaseTable
        filtered={filtered}
        loading={loading}
        onUpdateStatus={onUpdateStatus}
        onUpdateMode={onUpdateMode}
        onDelete={onDelete}
        onRefresh={onRefresh}   
      />
    </div>
  );
}