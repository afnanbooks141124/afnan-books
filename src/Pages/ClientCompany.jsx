import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, FileText, Edit2, X, Trash2 } from "lucide-react";

export default function ClientCompany() {
  // 1. Data States
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Search State
  const [searchTerm, setSearchTerm] = useState("");
  
  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", gstin: "" });
  const [editId, setEditId] = useState(null); 

  // --- FETCH DATA ---
  const fetchCompanies = () => {
    setIsLoading(true);
    fetch(`https://afnan-books.onrender.com/api/companies`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setCompanies(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Failed to load companies");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // --- THE SEARCH FILTER ---
  const filteredCompanies = companies.filter((company) => {
    const companyName = company.name ? company.name.toLowerCase() : "";
    const companyGst = company.gstin ? company.gstin.toLowerCase() : "";
    const searchLower = searchTerm.toLowerCase();
    
    return companyName.includes(searchLower) || companyGst.includes(searchLower);
  });

  // --- SAVE OR UPDATE FUNCTION ---
  const handleSaveCompany = async (e) => {
    e.preventDefault();

    const url = editId 
      ? `https://afnan-books.onrender.com/api/companies/${editId}` 
      : `https://afnan-books.onrender.com/api/companies`;
      
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, gstin: formData.gstin }),
      });

      if (response.ok) {
        setFormData({ name: "", gstin: "" });
        setEditId(null);
        setIsModalOpen(false);
        fetchCompanies();
        toast.success(editId ? "Company updated successfully!" : "Company created successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save company");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const response = await fetch(`https://afnan-books.onrender.com/api/companies/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchCompanies();
        toast.success("Company deleted forever!");
      } else {
        toast.error("Could not delete company from server");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete company");
    }
  };

  // --- MODAL CONTROLS ---
  const openEditModal = (company) => {
    setFormData({ name: company.name, gstin: company.gstin });
    setEditId(company._id);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ name: "", gstin: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600 w-5 h-5" />
            <h1 className="text-lg font-bold text-gray-800">My Company</h1>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredCompanies.length}
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Company Name/ID" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Create Company
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3 w-16">Sr. No.</th>
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">GSTIN</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              
              {isLoading && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 font-medium">Loading...</td>
                </tr>
              )}

              {!isLoading && filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 font-medium">
                    {searchTerm ? "No matching companies found." : "No companies found. Click 'Create Company' to add one!"}
                  </td>
                </tr>
              )}

              {!isLoading && filteredCompanies.map((company, index) => (
                <tr key={company._id || index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{company.name}</td>
                  <td className="px-4 py-3 text-gray-500">{company.gstin}</td>
                  <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{company.client || "N/A"}</td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                    <button onClick={() => openEditModal(company)} className="text-blue-500 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(company._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              <h2 className="font-bold text-gray-800">{editId ? "Edit Company" : "Create New Company"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCompany} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                <input 
                  type="text" required value={formData.gstin}
                  onChange={(e) => setFormData({...formData, gstin: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  {editId ? "Update Company" : "Save Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}