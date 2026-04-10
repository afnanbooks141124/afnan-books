import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users, Search, Plus, Download, List, Video, FileText, Edit2, Trash2, X } from "lucide-react";

export default function UserRoles() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Primary User", mobile: "" });

  // Fetch users from backend
  const fetchUsers = () => {
    fetch("https://afnan-books.onrender.com/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to load users");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Save or Update User
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const url = editId ? `https://afnan-books.onrender.com/api/users/${editId}` : "https://afnan-books.onrender.com/api/users";
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", role: "Primary User", mobile: "" });
        setEditId(null);
        setIsModalOpen(false);
        fetchUsers();
        toast.success(editId ? "User updated!" : "User created successfully!");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`https://afnan-books.onrender.com/api/users/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchUsers();
        toast.success("User deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Open modals
  const openCreateModal = () => {
    setFormData({ name: "", email: "", role: "Primary User", mobile: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role, mobile: user.mobile });
    setEditId(user._id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600 w-5 h-5" />
            <h1 className="text-lg font-bold text-gray-800">User Management</h1>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{users.length}</span>
          </div>
          <div className="flex gap-6 text-sm hidden sm:flex">
            <button className="font-medium text-blue-600 border-b-2 border-blue-600 pb-1">User List</button>
            <button className="text-gray-500 hover:text-gray-700 pb-1">User Report</button>
            <button className="text-gray-500 hover:text-gray-700 pb-1">Roles</button>
          </div>
        </div>

        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by Name" className="pl-10 pr-4 py-1.5 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> Add User
          </button>
          <div className="hidden lg:flex items-center gap-2 border-l pl-4">
            <button className="p-1.5 text-gray-500 hover:text-blue-600 border rounded"><Download className="w-4 h-4" /></button>
            <button className="p-1.5 text-green-600 hover:bg-green-50 border rounded"><List className="w-4 h-4" /></button>
            <button className="p-1.5 text-red-600 hover:bg-red-50 border rounded"><Video className="w-4 h-4" /></button>
            <button className="p-1.5 text-blue-600 hover:bg-blue-50 border rounded"><FileText className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3 w-16">Sr. No.</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              
              {isLoading && <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>}
              {!isLoading && users.length === 0 && <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No users found. Click "Add User" to create one.</td></tr>}

              {!isLoading && users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 text-gray-500">{user.mobile}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                    <button onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="font-bold text-gray-800">{editId ? "Edit User" : "Add New User"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white">
                    <option>Primary User</option>
                    <option>Admin</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No.</label>
                  <input type="text" required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editId ? "Update User" : "Save User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}