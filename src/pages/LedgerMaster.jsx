import { Search, Plus, Download, Play, FileText } from "lucide-react";

export default function LedgerMaster() {
  return (
    <div className="bg-white border rounded-xl flex flex-col min-h-[80vh]">
      
      {/* Top Header */}
      <div className="border-b px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Title and Search */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded">
              <FileText className="text-blue-600 w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Ledger</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name" 
              className="pl-10 pr-4 py-1.5 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 border rounded transition">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b px-4 flex items-center justify-between overflow-x-auto">
        <div className="flex gap-6">
          <button className="py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">
            Ledger
          </button>
          <button className="py-3 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Item
          </button>
          <button className="py-3 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Rule List
          </button>
        </div>
        
        <div className="flex gap-2 py-2 ml-4">
          <button className="p-1.5 text-red-600 hover:bg-red-50 border rounded transition">
            <Play className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-blue-600 hover:bg-blue-50 border rounded transition">
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Body: Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/30 rounded-b-xl">
        <div className="relative mb-4">
          {/* Decorative background shapes mimicking the illustration */}
          <div className="absolute w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60 -top-4 -left-4"></div>
          <Search className="relative z-10 w-24 h-24 text-blue-200 stroke-1" />
        </div>
        <h2 className="text-lg font-bold text-red-500 tracking-wide">
          No Data Found
        </h2>
      </div>

    </div>
  );
}