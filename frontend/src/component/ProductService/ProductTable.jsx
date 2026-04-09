// components/ProductService/ProductTable.jsx

const ProductTable = ({ items, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        {/* Header */}
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {["Items", "Qty", "MRP", "Selling Price", "Taxable Amount", "Cost Price", "Action"].map(
              (col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                No items found.
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-amber-50 transition-colors duration-100"
              >
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.qty}</td>
                <td className="px-4 py-3 text-gray-600 font-bold whitespace-nowrap">
                  ₹ {item.mrp.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-gray-600 font-bold whitespace-nowrap">
                  {item.sellingPrice}
                </td>
                <td className="px-4 py-3 text-gray-600 font-bold whitespace-nowrap">
                  {item.taxableAmount}
                </td>
                <td className="px-4 py-3 text-gray-700 font-bold whitespace-nowrap">
                  ₹ {item.costPrice.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* View */}
                    <button
                      onClick={() => onView && onView(item)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit && onEdit(item)}
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 0 1 2.828 2.828L11.828 15.828a2 2 0 0 1-1.414.586H7v-3a2 2 0 0 1 .586-1.414z" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete && onDelete(item)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1m-4 0h10" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;