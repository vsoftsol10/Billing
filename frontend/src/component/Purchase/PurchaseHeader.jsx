export default function PurchaseHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-900 font-bold leading-tight">Keep track of all your purchases and expenses</h2>
      </div>
      <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl shadow transition-all">
        <span className="text-lg leading-none">+</span> Purchase
      </button>
    </div>
  );
}