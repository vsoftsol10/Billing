export const tabs = ["All", "Pending", "Paid", "Cancelled", "Draft"];

export const initialPurchases = [
  { id: 1019, vendor: "Globe Inc",        mode: "UPI", amount: 8750, date: "2026-01-14", status: "Pending" },
  { id: 1022, vendor: "Stark Industries", mode: "UPI", amount: 4550, date: "2026-01-09", status: "Paid"    },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Draft"   },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Cancelled" },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Pending"  },
];
   
export const statusStyles = {
  Pending:   "bg-orange-100 text-orange-500 border border-orange-300",
  Paid:      "bg-green-100  text-green-700  border border-green-300",
  Cancelled: "bg-red-100    text-red-500    border border-red-300",
  Draft:     "bg-gray-100   text-gray-500   border border-gray-300",
};

export const statusOptions = [
  "Pending",
  "Paid",
  "Cancelled",
  "Draft",
];

export const modeOptions = [
  "UPI",
  "Cash",
  "Card",
  "Net Banking",
  "Cheque",
];

export const modeStyles = {
  UPI:          "bg-blue-500 text-white",
  Cash:         "bg-green-500 text-white",
  Card:         "bg-purple-500 text-white",
  "Net Banking": "bg-indigo-500 text-white",
  Cheque:       "bg-amber-500 text-white",
};

export function formatINR(n) {
  return "₹ " + n.toLocaleString("en-IN");
}