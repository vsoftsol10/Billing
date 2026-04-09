import { tabs } from './purchaseConstants';

export default function PurchaseTabs({ activeTab, setActiveTab }) {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 bottom-0 w-6 pointer-events-none z-10" />
      <div className="flex gap-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
              activeTab === tab
                ? 'bg-amber-400 text-gray-900 border-amber-400 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}