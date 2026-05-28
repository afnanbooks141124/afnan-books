import { useState } from "react";

// MOCK DATA: Simulating recent accounting voucher entries
const mockEntries = [
  { id: 1, date: "24-Apr-2026", voucherNo: "SAL-0042", type: "Sales", party: "Afnan Enterprises", amount: "₹ 45,000", status: "Synced" },
  { id: 2, date: "23-Apr-2026", voucherNo: "PUR-1028", type: "Purchase", party: "Global Tech Solutions", amount: "₹ 12,500", status: "Draft" },
  { id: 3, date: "22-Apr-2026", voucherNo: "RCT-0505", type: "Receipt", party: "Adnan Traders", amount: "₹ 10,000", status: "Synced" },
  { id: 4, date: "22-Apr-2026", voucherNo: "PMT-0891", type: "Payment", party: "Sharma Logistics", amount: "₹ 5,200", status: "Pending" },
  { id: 5, date: "21-Apr-2026", voucherNo: "SAL-0043", type: "Sales", party: "Adnan Traders", amount: "₹ 28,000", status: "Synced" },
  { id: 6, date: "20-Apr-2026", voucherNo: "JRN-0012", type: "Journal", party: "Depreciation A/c", amount: "₹ 4,500", status: "Synced" },
];

export default function DataEntry() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Tab Options
  const tabs = ["All", "Sales", "Purchase", "Receipt", "Payment", "Journal"];

  // Filter logic for tabs and search
  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = entry.party.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.voucherNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || entry.type === activeTab;
    return matchesSearch && matchesTab;
  });

  // Helper function to color-code voucher types
  const getTypeColor = (type) => {
    switch(type) {
      case "Sales": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Purchase": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Receipt": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Payment": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full flex flex-col h-full">
      
      {/* HEADER SECTION */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Data Entry Records</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and verify your accounting vouchers before syncing to Tally/ERP.</p>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Import Excel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <span>+</span> New Voucher
            </button>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex overflow-x-auto w-full sm:w-auto hide-scrollbar gap-2 pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? "bg-gray-800 text-white shadow-sm" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search Party or Voucher..." 
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Voucher No.</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Party / Account</th>
              <th className="p-4 font-semibold text-right">Amount</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{entry.date}</td>
                  <td className="p-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline">{entry.voucherNo}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded border text-xs font-semibold ${getTypeColor(entry.type)}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">{entry.party}</td>
                  <td className="p-4 text-sm font-bold text-gray-800 text-right">{entry.amount}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.status === "Synced" ? "bg-green-500" : 
                        entry.status === "Draft" ? "bg-gray-400" : "bg-yellow-500"
                      }`}></div>
                      <span className="text-gray-600">{entry.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm flex justify-center gap-2">
                    <button className="text-gray-500 hover:text-blue-600 p-1.5 transition-colors" title="Edit">✏️</button>
                    <button className="text-gray-500 hover:text-red-600 p-1.5 transition-colors" title="Delete">🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">📄</span>
                    <p className="text-lg font-medium text-gray-700">No entries found</p>
                    <p className="text-sm mt-1">Try changing your filters or add a new voucher.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}