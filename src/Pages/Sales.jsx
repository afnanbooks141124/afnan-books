import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sales() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tally-Style Filters
  const [filterMonth, setFilterMonth] = useState(""); 
  const [filterStatus, setFilterStatus] = useState("All");

  // 1. FETCH SALES (With LocalStorage memory for offline mode)
  const fetchSales = async () => {
    try {
      const response = await fetch("https://afnan-books.onrender.com/api/sales");
      if (!response.ok) throw new Error("Backend offline");
      const data = await response.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn("Backend offline. Using LocalStorage memory.");
      // Check if we saved anything from the Invoice page!
      const savedLocal = JSON.parse(localStorage.getItem("offlineSales"));
      if (savedLocal && savedLocal.length > 0) {
        setSales(savedLocal);
      } else {
        const dummyData = [
          { _id: "1", invoiceNumber: "INV-2041", clientName: "Tech Solutions", amount: 45000, date: "2026-05-09", status: "Paid" },
          { _id: "2", invoiceNumber: "INV-2042", clientName: "Global Retail", amount: 12500, date: "2026-05-08", status: "Pending" }
        ];
        setSales(dummyData);
        localStorage.setItem("offlineSales", JSON.stringify(dummyData));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  // 2. DELETE SALE
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this invoice record?")) return;
    try {
      const response = await fetch(`https://afnan-books.onrender.com/api/sales/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      fetchSales();
    } catch (error) {
      // Offline delete
      const updated = sales.filter(s => s._id !== id);
      setSales(updated);
      localStorage.setItem("offlineSales", JSON.stringify(updated));
    }
  };

  // 3. EDIT SALE (Teleports back to invoice page)
  const handleEdit = (sale) => {
    navigate('/invoices', { state: { editMode: true, saleData: sale } });
  };

  // 4. REPORTING MATH
  const filteredSales = sales.filter(s => {
    const matchesMonth = filterMonth === "" || s.date.startsWith(filterMonth);
    const matchesStatus = filterStatus === "All" || s.status === filterStatus;
    return matchesMonth && matchesStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalRevenue = filteredSales.filter(s => s.status === "Paid").reduce((sum, s) => sum + Number(s.amount), 0);
  const pendingAmount = filteredSales.filter(s => s.status === "Pending").reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Register</h1>
          <p className="text-gray-500 text-sm mt-1">Month-wise sales reporting and invoice tracking</p>
        </div>
        <button 
          onClick={() => navigate('/invoices')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors"
        >
          ➕ Create New Invoice
        </button>
      </div>

      {/* FILTERS & SUMMARY */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-gray-800 text-lg">Sales Report</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input type="month" className="p-2 border rounded-md focus:outline-blue-500 text-sm font-medium text-gray-700" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
            <select className="p-2 border rounded-md focus:outline-blue-500 text-sm font-medium text-gray-700" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x border-b bg-white">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Paid (Collected)</p>
            <p className="text-xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 text-center bg-yellow-50">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Pending</p>
            <p className="text-xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>
        
        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 font-bold text-gray-700 text-sm border-r">Date</th>
                <th className="p-3 font-bold text-gray-700 text-sm border-r">Invoice #</th>
                <th className="p-3 font-bold text-gray-700 text-sm border-r w-1/3">Client Name</th>
                <th className="p-3 font-bold text-gray-700 text-sm text-center border-r">Status</th>
                <th className="p-3 font-bold text-gray-700 text-sm text-right border-r">Amount (₹)</th>
                <th className="p-3 font-bold text-gray-700 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                  <td className="p-3 text-gray-600 text-sm border-r">{sale.date}</td>
                  <td className="p-3 font-mono text-sm text-blue-600 font-bold border-r">{sale.invoiceNumber}</td>
                  <td className="p-3 font-semibold text-gray-800 border-r">{sale.clientName}</td>
                  <td className="p-3 text-center border-r">
                    {sale.status === "Paid" && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Paid</span>}
                    {sale.status === "Pending" && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pending</span>}
                    {sale.status === "Overdue" && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Overdue</span>}
                  </td>
                  <td className="p-3 text-right font-bold text-gray-700 border-r">₹{Number(sale.amount).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(sale)} className="text-gray-500 hover:text-blue-600" title="Edit/View Invoice">✏️</button>
                      <button onClick={() => handleDelete(sale._id)} className="text-red-400 hover:text-red-600" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (<tr><td colSpan="6" className="p-8 text-center text-gray-500">No sales recorded. Create an invoice!</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}