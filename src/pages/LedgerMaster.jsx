import { useState, useEffect } from "react";

export default function LedgerMaster() {
  const [activeTab, setActiveTab] = useState("items"); // 'items' or 'accounts'
  
  // --- STATE FOR ITEMS & SERVICES ---
  const [items, setItems] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: "", type: "Service", hsnSac: "", price: "", taxRate: 18
  });

  // --- STATE FOR LEDGER ACCOUNTS ---
  const [accounts, setAccounts] = useState([]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: "", group: "Indirect Expenses", openingBalance: 0
  });

  // LOAD DATA
  useEffect(() => {
    // Load Items
    const savedItems = JSON.parse(localStorage.getItem("masterItems")) || [
      { _id: "i1", name: "IT Consulting Services", type: "Service", hsnSac: "9983", price: 5000, taxRate: 18 },
      { _id: "i2", name: "Software License (Annual)", type: "Service", hsnSac: "9973", price: 15000, taxRate: 18 },
      { _id: "i3", name: "Office Laptop (Dell)", type: "Goods", hsnSac: "8471", price: 65000, taxRate: 18 }
    ];
    setItems(savedItems);

    // Load Accounts
    const savedAccounts = JSON.parse(localStorage.getItem("masterAccounts")) || [
      { _id: "a1", name: "Sales Account", group: "Direct Income", openingBalance: 0 },
      { _id: "a2", name: "Office Rent", group: "Indirect Expenses", openingBalance: 0 },
      { _id: "a3", name: "Internet & Telephone", group: "Indirect Expenses", openingBalance: 0 },
      { _id: "a4", name: "Computers & Equipment", group: "Fixed Assets", openingBalance: 120000 }
    ];
    setAccounts(savedAccounts);
  }, []);

  // --- HANDLERS FOR ITEMS ---
  const handleSaveItem = (e) => {
    e.preventDefault();
    const newItem = { ...itemForm, _id: `item_${Date.now()}`, price: Number(itemForm.price) };
    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    localStorage.setItem("masterItems", JSON.stringify(updatedItems));
    setItemForm({ name: "", type: "Service", hsnSac: "", price: "", taxRate: 18 });
    setShowItemForm(false);
  };

  const handleDeleteItem = (id) => {
    if(!window.confirm("Delete this master item?")) return;
    const updated = items.filter(i => i._id !== id);
    setItems(updated);
    localStorage.setItem("masterItems", JSON.stringify(updated));
  };

  // --- HANDLERS FOR ACCOUNTS ---
  const handleSaveAccount = (e) => {
    e.preventDefault();
    const newAcc = { ...accountForm, _id: `acc_${Date.now()}`, openingBalance: Number(accountForm.openingBalance) };
    const updatedAccs = [newAcc, ...accounts];
    setAccounts(updatedAccs);
    localStorage.setItem("masterAccounts", JSON.stringify(updatedAccs));
    setAccountForm({ name: "", group: "Indirect Expenses", openingBalance: 0 });
    setShowAccountForm(false);
  };

  const handleDeleteAccount = (id) => {
    if(!window.confirm("Delete this ledger account?")) return;
    const updated = accounts.filter(a => a._id !== id);
    setAccounts(updated);
    localStorage.setItem("masterAccounts", JSON.stringify(updated));
  };

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Data</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your Products, Services, and Chart of Accounts</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab("items")} 
          className={`px-6 py-3 font-bold text-sm border-b-4 transition-colors ${activeTab === "items" ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
        >
          📦 Products & Services
        </button>
        <button 
          onClick={() => setActiveTab("accounts")} 
          className={`px-6 py-3 font-bold text-sm border-b-4 transition-colors ${activeTab === "accounts" ? "border-teal-600 text-teal-700 bg-teal-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
        >
          📒 Chart of Accounts
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: PRODUCTS & SERVICES */}
      {/* ========================================== */}
      {activeTab === "items" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowItemForm(!showItemForm)} className={`px-5 py-2.5 rounded-lg font-bold shadow-md text-white transition-colors ${showItemForm ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}>
              {showItemForm ? "Cancel" : "➕ Add Product / Service"}
            </button>
          </div>

          {showItemForm && (
            <form onSubmit={handleSaveItem} className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
              <h3 className="font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">New Item Master</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input type="text" placeholder="Item Name / Description *" className="p-2.5 border rounded-lg md:col-span-2" required value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} />
                <select className="p-2.5 border rounded-lg font-medium" value={itemForm.type} onChange={(e) => setItemForm({...itemForm, type: e.target.value})}>
                  <option value="Goods">Goods</option>
                  <option value="Service">Service</option>
                </select>
                <input type="text" placeholder="HSN / SAC Code" className="p-2.5 border rounded-lg" value={itemForm.hsnSac} onChange={(e) => setItemForm({...itemForm, hsnSac: e.target.value})} />
                <input type="number" placeholder="Default Price (₹) *" className="p-2.5 border rounded-lg" required value={itemForm.price} onChange={(e) => setItemForm({...itemForm, price: e.target.value})} />
                <div className="flex items-center gap-2 border bg-white p-2.5 rounded-lg">
                  <span className="text-sm font-bold text-gray-500">GST:</span>
                  <select className="flex-1 outline-none font-bold" value={itemForm.taxRate} onChange={(e) => setItemForm({...itemForm, taxRate: Number(e.target.value)})}>
                    <option value={0}>0%</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end"><button type="submit" className="bg-blue-700 text-white font-bold px-8 py-2 rounded-lg">Save Item</button></div>
            </form>
          )}

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-bold text-gray-700 text-sm">Item Name</th>
                  <th className="p-4 font-bold text-gray-700 text-sm">Type</th>
                  <th className="p-4 font-bold text-gray-700 text-sm">HSN/SAC</th>
                  <th className="p-4 font-bold text-gray-700 text-sm text-right">Default Rate (₹)</th>
                  <th className="p-4 font-bold text-gray-700 text-sm text-center">Tax</th>
                  <th className="p-4 font-bold text-gray-700 text-sm text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{item.name}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'Goods' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{item.type}</span></td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{item.hsnSac || "-"}</td>
                    <td className="p-4 text-right font-bold text-gray-700">₹{item.price.toLocaleString()}</td>
                    <td className="p-4 text-center font-bold text-gray-600">{item.taxRate}%</td>
                    <td className="p-4 text-center"><button onClick={() => handleDeleteItem(item._id)} className="text-red-400 hover:text-red-600">🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: CHART OF ACCOUNTS */}
      {/* ========================================== */}
      {activeTab === "accounts" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowAccountForm(!showAccountForm)} className={`px-5 py-2.5 rounded-lg font-bold shadow-md text-white transition-colors ${showAccountForm ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"}`}>
              {showAccountForm ? "Cancel" : "➕ Add Ledger Account"}
            </button>
          </div>

          {showAccountForm && (
            <form onSubmit={handleSaveAccount} className="bg-teal-50 p-6 rounded-xl border border-teal-200 shadow-sm">
              <h3 className="font-bold text-teal-800 mb-4 border-b border-teal-200 pb-2">New Ledger Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Account Name (e.g. Printing & Stationery) *" className="p-2.5 border rounded-lg" required value={accountForm.name} onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} />
                
                <select className="p-2.5 border rounded-lg font-medium" value={accountForm.group} onChange={(e) => setAccountForm({...accountForm, group: e.target.value})}>
                  <optgroup label="Income">
                    <option value="Direct Income">Direct Income</option>
                    <option value="Indirect Income">Indirect Income</option>
                  </optgroup>
                  <optgroup label="Expenses">
                    <option value="Direct Expenses">Direct Expenses</option>
                    <option value="Indirect Expenses">Indirect Expenses</option>
                  </optgroup>
                  <optgroup label="Assets & Liabilities">
                    <option value="Fixed Assets">Fixed Assets</option>
                    <option value="Current Liabilities">Current Liabilities</option>
                  </optgroup>
                </select>

                <input type="number" placeholder="Opening Balance (Optional)" className="p-2.5 border rounded-lg" value={accountForm.openingBalance} onChange={(e) => setAccountForm({...accountForm, openingBalance: e.target.value})} />
              </div>
              <div className="mt-4 flex justify-end"><button type="submit" className="bg-teal-700 text-white font-bold px-8 py-2 rounded-lg">Save Account</button></div>
            </form>
          )}

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-bold text-gray-700 text-sm">Account Name (Ledger)</th>
                  <th className="p-4 font-bold text-gray-700 text-sm">Account Group</th>
                  <th className="p-4 font-bold text-gray-700 text-sm text-right">Opening Balance (₹)</th>
                  <th className="p-4 font-bold text-gray-700 text-sm text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{acc.name}</td>
                    <td className="p-4 text-sm text-gray-600 font-bold">{acc.group}</td>
                    <td className="p-4 text-right font-mono text-gray-700">₹{acc.openingBalance.toLocaleString()}</td>
                    <td className="p-4 text-center"><button onClick={() => handleDeleteAccount(acc._id)} className="text-red-400 hover:text-red-600">🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}