import { useState } from "react";

export default function GSTManager() {
  const [activeTab, setActiveTab] = useState("GST");

  // Sample data based on your Vyapar TaxOne screenshot
  const gstRecords = [
    { 
      name: "SADANAND PVC PVT LTD", 
      gstin: "29AAUCS5128C1Z1", 
      user: "-", 
      password: "-" 
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2 text-blue-800 font-semibold">
          <span className="text-xl">📑</span> GST Manager
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-300 hover:bg-gray-50 p-1.5 rounded text-gray-600 shadow-sm transition-colors">
            ☁️
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 p-1.5 rounded text-gray-600 shadow-sm transition-colors">
            🔔
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 bg-white">
        <button className="px-6 py-3 text-sm font-bold border-b-2 border-blue-600 text-blue-600 transition-colors">
          GST
        </button>
      </div>

      {/* Data Table with Inline Search Bars */}
      <div className="flex-1 overflow-auto bg-white rounded-b-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-semibold w-16 align-top">
                <div className="mb-2 mt-1">Sr. No.</div>
              </th>
              <th className="p-4 font-semibold">
                <div className="mb-2">Company Name</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white" 
                />
              </th>
              <th className="p-4 font-semibold">
                <div className="mb-2">GSTIN <span className="text-gray-400 font-normal ml-1">▽</span></div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white" 
                />
              </th>
              <th className="p-4 font-semibold">
                <div className="mb-2">User Name</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white" 
                />
              </th>
              <th className="p-4 font-semibold">
                <div className="mb-2">Password</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white" 
                />
              </th>
              <th className="p-4 font-semibold text-center align-top pt-5">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {gstRecords.map((record, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="p-4 text-gray-500">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{record.name}</td>
                <td className="p-4 text-gray-600 flex justify-between items-center group">
                  {record.gstin} 
                  <span className="text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all">✎</span>
                </td>
                <td className="p-4 text-gray-500 flex justify-between items-center group">
                  {record.user} 
                  <span className="text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all">✎</span>
                </td>
                <td className="p-4 text-gray-500 flex justify-between items-center group">
                  {record.password} 
                  <span className="text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all">✎</span>
                </td>
                <td className="p-4 text-center text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-lg">
                  ⚙️
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}