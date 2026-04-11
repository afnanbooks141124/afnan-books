import { Plus, Settings, Video, CalendarX2, Search } from "lucide-react";

export default function Analysis() {
  const tabs = [
    "Financial Overview", 
    "Transaction Analysis", 
    "Accounting Details", 
    "Top Performers", 
    "Trends and Analysis"
  ];

  return (
    <div className="bg-white border rounded-xl flex flex-col min-h-[80vh]">
      
      {/* Top Header & Tabs */}
      <div className="border-b px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto w-full">
          
          {/* Blue Plus Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition shrink-0 my-2">
            <Plus className="w-5 h-5" />
          </button>
          
          {/* Tabs */}
          <div className="flex gap-6">
            {tabs.map((tab, idx) => (
              <button 
                key={tab} 
                className={`py-4 text-sm font-medium whitespace-nowrap flex items-center gap-2
                  ${idx === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab} 
                {/* Add a tiny dropdown arrow to the first tab like in the screenshot */}
                {idx === 0 && <span className="text-[10px] opacity-70">▼</span>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Side Icons */}
        <div className="flex items-center gap-2 py-2 ml-4 pl-4 border-l">
          <button className="p-1.5 text-gray-500 hover:text-blue-600 border rounded transition">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-red-600 hover:bg-red-50 border rounded transition">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Body: Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 rounded-b-xl">
        
        {/* Custom Illustration built with Tailwind and Lucide Icons */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Light blue background shapes */}
          <div className="absolute w-48 h-48 bg-blue-50 rounded-full blur-xl opacity-70"></div>
          
          <div className="relative z-10 text-blue-100 flex">
            <CalendarX2 className="w-32 h-32 stroke-[1] text-blue-200" />
            
            {/* The magnifying glass with the red X */}
            <div className="absolute -bottom-4 -right-4">
              <div className="relative bg-white rounded-full p-2 shadow-sm border border-gray-100">
                <Search className="w-16 h-16 stroke-[1.5] text-red-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-red-500 font-bold text-2xl -mt-2 -ml-2">x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg md:text-xl font-bold text-gray-800 max-w-md leading-relaxed">
          No Data available for selected time period please select another time period
        </h2>
      </div>

    </div>
  );
}