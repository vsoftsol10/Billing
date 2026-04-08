// components/ProductService/ProductFilters.jsx
import { useState } from "react";

const ProductFilters = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search"
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition whitespace-nowrap"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4h18M7 8h10M11 12h2M9 16h6" />
        </svg>
        Filters
      </button>
    </div>
  );
};

export default ProductFilters;