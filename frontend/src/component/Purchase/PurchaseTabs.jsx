import { tabs } from './purchaseConstants';

export default function PurchaseTabs({ activeTab, setActiveTab }) {
  return (
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
  );
}