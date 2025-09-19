export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
        <span className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold text-2xl">
          ₹
        </span>
      </div>
    </div>
  );
}
