import PurchaseTabs from './PurchaseTabs';
import PurchaseSearch from './PurchaseSearch';
import PurchaseTable from './PurchaseTable';

export default function PurchaseCard({ activeTab, setActiveTab, tableSearch, setTableSearch, filtered }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Tabs + search row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-3">

        <PurchaseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <PurchaseSearch tableSearch={tableSearch} setTableSearch={setTableSearch} />

      </div>
      {/* END: Tabs + search row */}

      <PurchaseTable filtered={filtered} />

    </div>
  );
}