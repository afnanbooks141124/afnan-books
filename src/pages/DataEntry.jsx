import { Plus, Calendar, ChevronDown, Archive, Search } from "lucide-react";

export default function DataEntry() {
  const quickCreateButtons = [
    "Banking", "Sales", "Sales Return", "Purchase", 
    "Purchase Return", "Journal", "Ledger", "Item"
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Row: Quick Create & Transactions Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Quick Create Box */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <span className="font-bold text-gray-800">SADANAND PVC PVT LT...</span>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-md border">
              01/04/2026 - 31/03/2027 <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-4">Quick Create</h3>
          <div className="flex flex-wrap gap-3">
            {quickCreateButtons.map((btn) => (
              <button 
                key={btn} 
                className="flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Transactions sent to Tally */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800">Transactions sent to Tally</h3>
            <div className="flex gap-2">
              <button className="flex items-center justify-between w-24 px-3 py-1 text-sm border rounded-md text-gray-600 hover:bg-gray-50">
                All <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-between w-24 px-3 py-1 text-sm border rounded-md text-gray-600 hover:bg-gray-50">
                Today <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Banking</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Sales</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Purchase</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Journal</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: The 3 Data Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top 5 Customer */}
        <div className="bg-white border rounded-xl p-5 shadow-sm h-72 flex flex-col">
          <div className="flex justify-between items-center border-b pb-3 mb-3">
            <h3 className="font-bold text-gray-800">Top 5 Customer</h3>
            <button className="text-sm text-gray-500 flex items-center border px-2 py-1 rounded">Top 5 <ChevronDown className="w-3 h-3 ml-1" /></button>
          </div>
          <div className="flex text-xs text-gray-500 font-medium mb-4">
            <span className="w-12">Sr. No.</span>
            <span className="flex-1">Customer Name</span>
            <span>Total Amount</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Archive className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No data</p>
          </div>
        </div>

        {/* Top 5 Supplier */}
        <div className="bg-white border rounded-xl p-5 shadow-sm h-72 flex flex-col">
          <div className="flex justify-between items-center border-b pb-3 mb-3">
            <h3 className="font-bold text-gray-800">Top 5 Supplier</h3>
            <button className="text-sm text-gray-500 flex items-center border px-2 py-1 rounded">Top 5 <ChevronDown className="w-3 h-3 ml-1" /></button>
          </div>
          <div className="flex text-xs text-gray-500 font-medium mb-4">
            <span className="w-12">Sr. No.</span>
            <span className="flex-1">Supplier Name</span>
            <span>Total Amount</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Archive className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No data</p>
          </div>
        </div>

        {/* Payment vs Receipt */}
        <div className="bg-white border rounded-xl p-5 shadow-sm h-72 flex flex-col">
          <div className="border-b pb-3 mb-3">
            <h3 className="font-bold text-gray-800">Payment vs Receipt</h3>
          </div>
          <div className="flex text-sm text-gray-600 font-medium mb-4 border-b pb-2">
            <span className="flex-1 text-center border-r">Payment</span>
            <span className="flex-1 text-center">Receipt</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Search className="w-16 h-16 text-blue-200 mb-2" />
            <p className="text-sm font-bold text-red-500">No Data Found</p>
          </div>
        </div>

      </div>
    </div>
  );
}