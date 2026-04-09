export default function PurchaseHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-base sm:text-lg lg:text-xl text-gray-900 font-bold leading-snug">
        Keep track of all your purchases and expenses
      </h2>
      <button className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-all">
        <span className="text-lg leading-none">+</span> Add Purchase
      </button>
    </div>
  );
}