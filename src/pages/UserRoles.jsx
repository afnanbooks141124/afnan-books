import { useState } from "react";

export default function UserRoles() {
  const [activeTab, setActiveTab] = useState("User List");

  const users = [
    { name: "Afrid R Goundi", email: "admin@company.com", role: "Primary User / Accounts Manager", mobile: "9071414455", status: "-" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 font-semibold">
          <span className="text-xl">👥</span> User Management <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by Name" 
              className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
            />
            <span className="absolute left-2 text-gray-400 top-1.5 text-sm">🔍</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">You have <span className="text-blue-600">1</span> unused credits</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
            + Add User
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 p-1.5 rounded text-gray-600">📄</button>
          <button className="border border-gray-300 hover:bg-gray-50 p-1.5 rounded text-gray-600">▶️</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4">
        {["User List", "User Report", "Roles"].map(tab => (
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
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Assigned Role</th>
              <th className="p-4 font-semibold">Mobile</th>
              <th className="p-4 font-semibold">Status ▽</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {users.map((user, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4 text-gray-500">{user.role}</td>
                <td className="p-4 text-gray-500">{user.mobile}</td>
                <td className="p-4 text-gray-400">{user.status}</td>
                <td className="p-4 text-center text-gray-400 hover:text-gray-800 cursor-pointer">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}