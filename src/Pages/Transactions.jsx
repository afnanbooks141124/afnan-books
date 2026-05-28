import { useState } from "react";

export default function Transactions() {
  const [activeTab, setActiveTab] = useState("Sales");

  const tabs = ["Sales", "Purchase", "Payment", "Receipt", "Contra"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2 text-blue-800 font-semibold">
          <span className="text-xl">💸</span> Transactions
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search here..." 
              className="pl-4 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-64 bg-white"
            />
            <span className="absolute right-3 text-gray-400 top-1.5 text-sm cursor-pointer">🔍</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-300 hover:bg-gray-50 p-1.5 rounded text-blue-600 font-bold">+</button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 p-1.5 rounded text-gray-600">☁️</button>
          
          <select className="border border-gray-300 bg-white rounded px-3 py-1.5 text-sm text-gray-600 focus:outline-none">
            <option>SADANAND PVC PVT LTD</option>
          </select>
        </div>
      </div>

      {/* Tabs & Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4">
        <div className="flex">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2">
            ☁️ Upload Image ▽
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium">
            + Create Bill
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 p-1 rounded text-red-600 text-lg">▶️</button>
          <button className="border border-gray-300 hover:bg-gray-50 p-1 rounded text-gray-600 text-lg">📄</button>
        </div>
      </div>

      {/* Workflow UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-slate-50/50">
        <h3 className="text-gray-800 font-semibold mb-6">Please follow below the steps to upload a {activeTab.toLowerCase()} file</h3>
        
        {/* Video Placeholder Container */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 w-[500px] h-[250px] rounded-xl shadow-lg mb-10 flex flex-col items-center justify-center relative overflow-hidden border-4 border-white">
           <div className="absolute top-4 left-4 flex items-center gap-2 text-white font-semibold text-sm">
             <span className="bg-white text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">SV</span>
             How to process {activeTab.toLowerCase()} & ...
           </div>
           
           <button className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-red-700 transition-colors shadow-lg z-10">
             ▶
           </button>
           
           <div className="absolute bottom-4 left-0 w-full px-4 flex justify-between items-center text-white">
             <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm">⤴</button>
             <button className="bg-black/60 hover:bg-black/80 px-4 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium flex items-center gap-2">
               Watch on <span className="font-bold">YouTube</span>
             </button>
           </div>
        </div>

        {/* Workflow Steps Tracker */}
        <div className="w-full max-w-4xl relative">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 -mt-8 mb-4 shadow-sm">1</div>
              <h4 className="font-bold text-gray-800 text-sm mb-2">Upload</h4>
              <p className="text-xs text-gray-500"><a href="#" className="text-blue-600 hover:underline">Click on the upload</a> button to upload the {activeTab.toLowerCase()} file</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 -mt-8 mb-4 shadow-sm">2</div>
              <h4 className="font-bold text-gray-800 text-sm mb-2">Map the sheet data</h4>
              <p className="text-xs text-gray-500">Map the data with Tally fields</p>
            </div>

            <div className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 -mt-8 mb-4 shadow-sm">3</div>
              <h4 className="font-bold text-gray-800 text-sm mb-2">Save Transaction</h4>
              <p className="text-xs text-gray-500">Select the ledger, other details and click on the save button</p>
            </div>

            <div className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 -mt-8 mb-4 shadow-sm">4</div>
              <h4 className="font-bold text-gray-800 text-sm mb-2">Send to Tally</h4>
              <p className="text-xs text-gray-500">Click on Send to Tally button to sync the transactions</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <span>👨‍💻</span> If you want to read documentation: <a href="#" className="text-blue-600 hover:underline font-medium">Click here</a>
        </div>
      </div>
    </div>
  );
}