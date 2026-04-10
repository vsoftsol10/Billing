// components/ProductService/ProductHeader.jsx
const ProductHeader = ({ onAddNew }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 font-bold leading-snug">
          Manage your products and services in one place
        </h2>
      </div>
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-black font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all duration-150 text-sm whitespace-nowrap self-start sm:self-auto"
      >
        <span className="text-lg leading-none">+</span>
        Add New
      </button>
    </div>
  );
};

export default ProductHeader;