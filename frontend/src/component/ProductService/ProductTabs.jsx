// components/ProductService/ProductTabs.jsx
const TABS = ["Items", "Categories", "Groups", "Price Lists", "Deleted"];

const ProductTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-gray-200 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap transition-all duration-150 border-b-2 -mb-px
            ${
              activeTab === tab
                ? "bg-amber-400 text-white border-amber-400"
                : "text-gray-600 hover:text-gray-800 border-transparent hover:bg-gray-100"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProductTabs;