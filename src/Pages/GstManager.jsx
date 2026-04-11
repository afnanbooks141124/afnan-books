import { FileText, FileSpreadsheet, PlusCircle, Edit2, FileOutput } from "lucide-react";

export default function GstManager() {
  return (
    <div className="space-y-4">
      
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded">
            <FileText className="text-blue-600 w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">GST Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-blue-600 border rounded transition">
            <FileOutput className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-green-600 hover:bg-green-50 border rounded transition">
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b px-4 flex gap-6">
          <button className="py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            GST
          </button>
        </div>

        {/* Table wrapper with padding */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3 border-r w-16 align-top pt-5">Sr. No.</th>
                
                <th className="px-4 py-3 border-r">
                  <div className="mb-2">Company Name</div>
                  <input type="text" placeholder="Search" className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </th>
                
                <th className="px-4 py-3 border-r">
                  <div className="mb-2">GSTIN</div>
                  <input type="text" placeholder="Search" className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </th>
                
                <th className="px-4 py-3 border-r">
                  <div className="mb-2">User Name</div>
                  <input type="text" placeholder="Search" className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </th>
                
                <th className="px-4 py-3 border-r">
                  <div className="mb-2">Password</div>
                  <input type="text" placeholder="Search" className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </th>
                
                <th className="px-4 py-3 text-center align-top pt-5">Action</th>
              </tr>
            </thead>
            
            <tbody className="text-gray-700">
              <tr className="hover:bg-gray-50 transition border-b">
                <td className="px-4 py-3 border-r text-gray-500">1</td>
                
                <td className="px-4 py-3 border-r">SADANAND PVC PVT LTD</td>
                
                <td className="px-4 py-3 border-r">
                  <div className="flex items-center justify-between">
                    29AAUCS5128C1Z1 <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-600" />
                  </div>
                </td>
                
                <td className="px-4 py-3 border-r">
                  <div className="flex items-center justify-between">
                    - <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-600" />
                  </div>
                </td>
                
                <td className="px-4 py-3 border-r">
                  <div className="flex items-center justify-between">
                    - <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-600" />
                  </div>
                </td>
                
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-400 hover:text-blue-600">
                    <PlusCircle className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}