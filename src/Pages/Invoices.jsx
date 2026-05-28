import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Invoices() {
  const location = useLocation(); 
  const navigate = useNavigate();
  
  // Basic Invoice State
  const [invoiceDetails, setInvoiceDetails] = useState({
    _id: null,
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: "",
    clientGST: "",
    clientAddress: "",
    status: "Pending" // Added status for the Sales page!
  });

  const [items, setItems] = useState([{ id: 1, description: "", quantity: 1, rate: 0, amount: 0 }]);
  const [taxRate, setTaxRate] = useState(18); 

  // CATCH EDIT DATA FROM SALES DASHBOARD
  useEffect(() => {
    if (location.state && location.state.editMode && location.state.saleData) {
      const s = location.state.saleData;
      setInvoiceDetails({
        _id: s._id,
        invoiceNumber: s.invoiceNumber,
        date: s.date,
        dueDate: s.dueDate || s.date,
        clientName: s.clientName,
        clientGST: s.clientGST || "",
        clientAddress: "",
        status: s.status
      });
      setItems([{ id: 1, description: "Consulting / Goods", quantity: 1, rate: s.amount, amount: s.amount }]);
    }
  }, [location.state]);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
        return updatedItem;
      }
      return item;
    }));
  };

  const addItemRow = () => setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0, amount: 0 }]);
  const removeItemRow = (id) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  // --- SAVE DIRECTLY TO SALES DASHBOARD ---
  const handleSave = async () => {
    const saleRecord = {
      _id: invoiceDetails._id || `sale_${Date.now()}`,
      invoiceNumber: invoiceDetails.invoiceNumber,
      clientName: invoiceDetails.clientName || "Unknown Client",
      amount: grandTotal,
      date: invoiceDetails.date,
      status: invoiceDetails.status
    };

    try {
      // Try to save to actual backend
      const url = invoiceDetails._id ? `https://afnan-books.onrender.com/api/sales/${invoiceDetails._id}` : "https://afnan-books.onrender.com/api/sales";
      const method = invoiceDetails._id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleRecord)
      });
      if (!response.ok) throw new Error("Backend failed");
      
    } catch (error) {
      // OFFLINE MAGIC: Save it to LocalStorage so it shows up on the Sales page anyway!
      const localSales = JSON.parse(localStorage.getItem("offlineSales")) || [];
      
      if (invoiceDetails._id) {
        // Update existing
        const updated = localSales.map(s => s._id === invoiceDetails._id ? saleRecord : s);
        localStorage.setItem("offlineSales", JSON.stringify(updated));
      } else {
        // Create new
        localStorage.setItem("offlineSales", JSON.stringify([saleRecord, ...localSales]));
      }
    }

    // Instantly warp back to the Sales Page
    navigate('/sales');
  };

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b pb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{invoiceDetails._id ? "Edit Invoice" : "Invoice Generator"}</h1>
          <p className="text-gray-500 text-sm mt-1">Create invoice and save it directly to the Sales Register</p>
        </div>
        <div className="flex gap-3 items-center">
          <select 
            className="p-2.5 border-2 border-blue-200 rounded-lg font-bold text-gray-700 outline-none"
            value={invoiceDetails.status}
            onChange={(e) => setInvoiceDetails({...invoiceDetails, status: e.target.value})}
          >
            <option value="Paid">✅ Mark as Paid</option>
            <option value="Pending">⏳ Mark as Pending</option>
            <option value="Overdue">⚠️ Mark as Overdue</option>
          </select>
          
          <button onClick={handleSave} className="px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors bg-blue-600 hover:bg-blue-700 text-white">
            💾 Save & Return to Sales
          </button>
          <button onClick={() => window.print()} className="px-4 py-2.5 rounded-lg font-bold shadow-md transition-colors border-2 border-gray-300 text-gray-700 hover:bg-gray-100 bg-white">
            🖨️ Print
          </button>
        </div>
      </div>

      {/* THE INVOICE PAPER */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 print:shadow-none print:border-none print:p-0">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h2 className="text-3xl font-black text-blue-700 tracking-wider">INVOICE</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-gray-500 font-mono">#</span>
              <input type="text" className="font-mono text-gray-700 border-b border-dashed border-gray-300 focus:outline-none" value={invoiceDetails.invoiceNumber} onChange={(e) => setInvoiceDetails({...invoiceDetails, invoiceNumber: e.target.value})} />
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-gray-800 text-xl">Your Company Name</h3>
            <p className="text-gray-500 text-sm mt-1">123 Tech Park, Suite 400</p>
            <p className="text-gray-500 text-sm font-mono mt-1">GSTIN: 29ABCDE1234F1Z5</p>
          </div>
        </div>

        {/* CLIENT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Billed To:</p>
            <input type="text" placeholder="Client Name" className="w-full bg-transparent font-bold text-gray-800 text-lg border-b border-dashed border-gray-300 focus:outline-none pb-1 mb-2" value={invoiceDetails.clientName} onChange={(e) => setInvoiceDetails({...invoiceDetails, clientName: e.target.value})} />
            <input type="text" placeholder="Client GSTIN" className="w-full bg-transparent text-gray-600 font-mono text-sm border-b border-dashed border-gray-300 focus:outline-none pb-1 mb-2 uppercase" value={invoiceDetails.clientGST} onChange={(e) => setInvoiceDetails({...invoiceDetails, clientGST: e.target.value.toUpperCase()})} />
            <textarea placeholder="Address" className="w-full bg-transparent text-gray-600 text-sm focus:outline-none resize-none h-12" value={invoiceDetails.clientAddress} onChange={(e) => setInvoiceDetails({...invoiceDetails, clientAddress: e.target.value})} />
          </div>
          <div className="flex flex-col justify-center items-end gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">Invoice Date:</span>
              <input type="date" className="p-1 border rounded text-gray-700 font-medium" value={invoiceDetails.date} onChange={(e) => setInvoiceDetails({...invoiceDetails, date: e.target.value})} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">Due Date:</span>
              <input type="date" className="p-1 border rounded text-gray-700 font-medium" value={invoiceDetails.dueDate} onChange={(e) => setInvoiceDetails({...invoiceDetails, dueDate: e.target.value})} />
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b-2 border-blue-200">
                <th className="p-3 font-bold text-blue-800 w-1/2">Item Description</th>
                <th className="p-3 font-bold text-blue-800 text-center">Qty</th>
                <th className="p-3 font-bold text-blue-800 text-right">Rate (₹)</th>
                <th className="p-3 font-bold text-blue-800 text-right">Amount (₹)</th>
                <th className="p-3 print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-100 group">
                  <td className="p-3"><input type="text" placeholder="Description..." className="w-full bg-transparent focus:outline-none" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} /></td>
                  <td className="p-3"><input type="number" min="1" className="w-full bg-transparent text-center focus:outline-none" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} /></td>
                  <td className="p-3"><input type="number" min="0" className="w-full bg-transparent text-right focus:outline-none" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} /></td>
                  <td className="p-3 text-right font-bold text-gray-700">{item.amount.toLocaleString()}</td>
                  <td className="p-3 text-center print:hidden"><button onClick={() => removeItemRow(item.id)} className="text-red-300 hover:text-red-500 font-bold opacity-0 group-hover:opacity-100">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addItemRow} className="mt-4 text-sm font-bold text-blue-600 print:hidden">+ Add Line Item</button>
        </div>

        {/* MATH */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span className="font-bold">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between items-center text-gray-600 border-b pb-3">
              <span className="flex items-center gap-2">
                Tax (GST): 
                <select className="border rounded p-0.5 text-sm print:appearance-none" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))}>
                  <option value={0}>0%</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option>
                </select>
              </span>
              <span className="font-bold">₹{taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl text-blue-800 font-black pt-2"><span>Grand Total:</span><span>₹{grandTotal.toLocaleString()}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}