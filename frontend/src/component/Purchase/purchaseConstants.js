export const tabs = ["All", "PENDING", "PAID", "CANCELLED", "DRAFT"];

export const statusStyles = {
  PENDING:   "bg-orange-100 text-orange-500 border border-orange-300",
  PAID:      "bg-green-100  text-green-700  border border-green-300",
  CANCELLED: "bg-red-100    text-red-500    border border-red-300",
  DRAFT:     "bg-gray-100   text-gray-500   border border-gray-300",
};

export const statusOptions = ["PENDING", "PAID", "CANCELLED", "DRAFT"];

export const modeOptions = ["UPI", "CASH", "CARD", "BANK_TRANSFER", "CHEQUE", "OTHER"];

export const modeStyles = {
  UPI:           "bg-blue-500   text-white",
  CASH:          "bg-green-500  text-white",
  CARD:          "bg-purple-500 text-white",
  BANK_TRANSFER: "bg-indigo-500 text-white",
  CHEQUE:        "bg-amber-500  text-white",
  OTHER:         "bg-gray-400   text-white",
};

// In purchaseConstants.js, make formatINR handle Decimal objects:
// ✅ Handles Prisma Decimal strings, numbers, null, undefined
export const formatINR = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(num);
};