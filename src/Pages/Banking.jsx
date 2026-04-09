import { Download, Video, FileText, Play } from "lucide-react";

export default function Banking() {
  const tabs = ["Banking", "Sales", "Sales-Return", "Purchase", "Purchase-Return", "Journal", "Ledger", "Items"];

  return (
    <div className="bg-white border rounded-xl flex flex-col min-h-[80vh]">
      
      {/* Top Header & Tabs */}
      <div className="border-b px-4 flex items-center justify-between">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button 
              key={tab} 
              className={`py-4 text-sm font-medium whitespace-nowrap ${idx === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 py-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition">
            <Download className="w-4 h-4" /> Import
          </button>
          <button className="p-1.5 text-red-600 hover:bg-red-50 border rounded"><Video className="w-4 h-4" /></button>
          <button className="p-1.5 text-blue-600 hover:bg-blue-50 border rounded"><FileText className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-8 flex flex-col items-center flex-1">
        <h2 className="text-gray-800 font-bold mb-8">Please follow the below steps to upload the bank statement</h2>

        {/* Video Banner Placeholder */}
        <div className="w-full max-w-2xl bg-blue-900 rounded-xl overflow-hidden relative shadow-lg mb-16 h-64 flex flex-col items-center justify-center text-white text-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 justify-center bg-white/10 px-3 py-1 rounded-full text-sm font-medium w-max mx-auto">
              <span className="bg-white text-blue-900 px-1.5 rounded-full font-bold text-xs">Afnan</span>
              Bank Statement Processing
            </div>
            <h3 className="text-2xl font-bold">Bank Statement Processing</h3>
            <button className="bg-white text-gray-900 font-bold flex items-center gap-2 px-6 py-2 rounded-full hover:bg-gray-100 transition mx-auto mt-4">
              <Play className="w-4 h-4 fill-current text-red-600" /> Watch on YouTube
            </button>
          </div>
        </div>

        {/* Stepper Steps */}
        <div className="w-full max-w-4xl relative">
          {/* Horizontal connecting line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-blue-100 -z-10"></div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <StepItem number="1" title="Import Statement" desc="Click on the import statement to upload the bank statement" />
            <StepItem number="2" title="Upload the File" desc="Select the company, bank ledger and click on the upload button" />
            <StepItem number="3" title="Assign the ledger" desc="Assign the ledger to transactions and click on the save button" />
            <StepItem number="4" title="Send to Tally" desc="Click on Send to Tally button to sync the transactions" />
          </div>
        </div>

        <div className="mt-16 text-sm text-gray-600 flex items-center gap-2">
          <span>📚</span> If you want to read documentation: <a href="#" className="text-blue-600 font-medium hover:underline">Click here</a>
        </div>
      </div>
    </div>
  );
}

// Helper component for the 4 steps
function StepItem({ number, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-100 text-blue-600 font-bold flex items-center justify-center mb-4 shadow-sm">
        {number}
      </div>
      <div className="bg-white border rounded-lg p-4 shadow-sm w-full h-full">
        <h4 className="font-bold text-gray-800 text-sm mb-2">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}