export const tabs = ["All", "Pending", "Paid", "Cancelled", "Draft"];

export const initialPurchases = [
  { id: 1019, vendor: "Globe Inc",        mode: "UPI", amount: 8750, date: "2026-01-14", status: "Pending" },
  { id: 1022, vendor: "Stark Industries", mode: "UPI", amount: 4550, date: "2026-01-09", status: "Open"    },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Open"    },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Update"  },
  { id: 1009, vendor: "Soylent Corp",     mode: "UPI", amount: 2950, date: "2026-01-10", status: "Update"  },
];

export const statusStyles = {
  Pending:   "bg-orange-100 text-orange-500 border border-orange-300",
  Open:      "bg-green-100  text-green-600  border border-green-300",
  Update:    "bg-sky-100    text-sky-600    border border-sky-300",
  Paid:      "bg-green-100  text-green-700  border border-green-300",
  Cancelled: "bg-red-100    text-red-500    border border-red-300",
  Draft:     "bg-gray-100   text-gray-500   border border-gray-300",
};

export function formatINR(n) {
  return "₹ " + n.toLocaleString("en-IN");
}