import { useState, useEffect } from "react";

export default function ClientCompany() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Company");

  // Fetch live data from your Render Backend
  useEffect(() => {
    fetch("https://afnan-books.onrender.com/api/companies")
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch companies", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 font-semibold">
          <span className="text-xl">🏢</span> My Company <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by Company Name/ID" 
              className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
            />
            <span className="absolute left-2 text-gray-400 top-1.5 text-sm">🔍</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">You have <span className="text-blue-600">1/1</span> unused credits</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
            + Create Company
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
            Tally Sync 🔄
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4">
        {["Company", "Client"].map(tab => (
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

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="p-4 font-semibold">Sr. No.</th>
              <th className="p-4 font-semibold">Company Name</th>
              <th className="p-4 font-semibold">Trade Name</th>
              <th className="p-4 font-semibold">GSTIN</th>
              <th className="p-4 font-semibold">PAN No.</th>
              <th className="p-4 font-semibold">Client</th>
              <th className="p-4 font-semibold">Client Mobile No.</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {loading ? (
              <tr><td colSpan="9" className="text-center p-8 text-gray-400">Loading live data...</td></tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-8">
                  <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                    <span className="text-3xl opacity-50">📂</span>
                    No Company Found
                  </div>
                </td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">T</span> 
                    {company.name || "SADANAND PVC PVT LTD"}
                  </td>
                  <td className="p-4 text-gray-400">-</td>
                  <td className="p-4 text-gray-500">29AAUCS5128C1Z1 ✎</td>
                  <td className="p-4 text-gray-400">-</td>
                  <td className="p-4 text-blue-600 hover:underline cursor-pointer">Assign Client</td>
                  <td className="p-4 text-gray-400">-</td>
                  <td className="p-4 text-center text-gray-400 hover:text-gray-800 cursor-pointer">⋮</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}