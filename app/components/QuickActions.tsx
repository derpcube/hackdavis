export default function QuickActions() {
  return (
    <div className="bg-[#1e2538] rounded-lg p-4">
      <h2 className="text-gray-400 text-sm font-semibold mb-4">QUICK ACTIONS</h2>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-[#2a3142] hover:bg-[#2f3749] p-4 rounded-lg text-center">
          <div className="text-red-500 mb-2">🔔</div>
          <div className="text-sm">Report Fire</div>
        </button>
        <button className="bg-[#2a3142] hover:bg-[#2f3749] p-4 rounded-lg text-center">
          <div className="text-blue-500 mb-2">👥</div>
          <div className="text-sm">Request Help</div>
        </button>
      </div>
    </div>
  );
} 