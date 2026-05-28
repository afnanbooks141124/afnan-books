import { useState, useEffect, useRef } from "react";

export default function Banking() {
  // --- STATE MANAGEMENT ---
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI Controls
  const [activeForm, setActiveForm] = useState(null); // 'Receipt', 'Payment', 'Contra', 'Bank', or null
  const [editingTxId, setEditingTxId] = useState(null);
  const fileInputRef = useRef(null);

  // Filters for Tally-style reporting
  const [filterMonth, setFilterMonth] = useState(""); 
  const [filterAccount, setFilterAccount] = useState("All");

  // --- FORMS DATA ---
  const [bankFormData, setBankFormData] = useState({
    bankName: "", accountNumber: "", ifsc: "", branch: "", isPrimary: false
  });

  const [txFormData, setTxFormData] = useState({
    accountId: "", // For Receipt (To), Payment (From), Contra (From)
    contraAccountId: "", // Only used for Contra (To)
    amount: "",
    reference: "",
    date: new Date().toISOString().split('T')[0]
  });

  // --- 1. FETCH DATA (With Offline Fallbacks) ---
  const fetchData = async () => {
    try {
      // FIXED: Using Promise.all correctly to fetch both at the same time
      const [txRes, bankRes] = await Promise.all([
        fetch("https://afnan-books.onrender.com/api/banking"),
        fetch("https://afnan-books.onrender.com/api/banks")
      ]);
      
      if (!txRes.ok || !bankRes.ok) throw new Error("Offline");
      setTransactions(await txRes.json());
      setBankAccounts(await bankRes.json());
    } catch (error) {
      console.warn("Backend offline. Loading local dummy data.");
      setBankAccounts([
        { _id: "b1", bankName: "SBI Current", accountNumber: "32145678901", ifsc: "SBIN0001234", branch: "Main Branch", isPrimary: true },
        { _id: "b2", bankName: "Cash in Hand", accountNumber: "N/A", ifsc: "N/A", branch: "HQ", isPrimary: false }
      ]);
      setTransactions([
        { _id: "1", type: "Receipt", accountId: "b1", amount: 45000, reference: "Tech Solutions (Inv-01)", date: "2026-05-09" },
        { _id: "2", type: "Payment", accountId: "b1", amount: 1500, reference: "Internet Bill", date: "2026-05-08" },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. BANK ACCOUNT LOGIC ---
  const handleAddBank = (e) => {
    e.preventDefault();
    const newBank = { ...bankFormData, _id: `b${Date.now()}` };
    let updatedBanks = [...bankAccounts];
    if (newBank.isPrimary) updatedBanks = updatedBanks.map(b => ({ ...b, isPrimary: false }));
    setBankAccounts([newBank, ...updatedBanks]);
    setBankFormData({ bankName: "", accountNumber: "", ifsc: "", branch: "", isPrimary: false });
    setActiveForm(null);
  };

  // --- 3. TRANSACTION LOGIC (Receipt, Payment, Contra, Edit) ---
  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const amt = Number(txFormData.amount);

    if (editingTxId) {
      // UPDATE EXISTING
      setTransactions(transactions.map(tx => tx._id === editingTxId ? { ...tx, ...txFormData, type: activeForm, amount: amt } : tx));
    } else {
      // CREATE NEW
      if (activeForm === "Contra") {
        // Contra creates TWO entries automatically (Withdrawal from A, Deposit to B)
        const groupId = `contra_${Date.now()}`;
        const withdrawal = { _id: `tx${Date.now()}_1`, type: "Payment", accountId: txFormData.accountId, amount: amt, reference: `Contra: To ${getBankName(txFormData.contraAccountId)}`, date: txFormData.date, contraGroupId: groupId };
        const deposit = { _id: `tx${Date.now()}_2`, type: "Receipt", accountId: txFormData.contraAccountId, amount: amt, reference: `Contra: From ${getBankName(txFormData.accountId)}`, date: txFormData.date, contraGroupId: groupId };
        setTransactions([deposit, withdrawal, ...transactions]);
      } else {
        // Standard Receipt or Payment
        const newTx = { ...txFormData, type: activeForm, amount: amt, _id: `tx${Date.now()}` };
        setTransactions([newTx, ...transactions]);
      }
    }
    resetTxForm();
  };

  const handleEdit = (tx) => {
    if (tx.contraGroupId) return alert("Contra entries cannot be edited directly. Please delete and recreate.");
    setTxFormData({ accountId: tx.accountId, amount: tx.amount, reference: tx.reference, date: tx.date, contraAccountId: "" });
    setEditingTxId(tx._id);
    setActiveForm(tx.type); // Opens the correct tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id, contraGroupId) => {
    if (!window.confirm("Delete this entry?")) return;
    if (contraGroupId) {
      // Delete both sides of the contra
      setTransactions(transactions.filter(tx => tx.contraGroupId !== contraGroupId));
    } else {
      setTransactions(transactions.filter(tx => tx._id !== id));
    }
  };

  const resetTxForm = () => {
    setTxFormData({ accountId: bankAccounts.find(b=>b.isPrimary)?._id || "", contraAccountId: "", amount: "", reference: "", date: new Date().toISOString().split('T')[0] });
    setEditingTxId(null);
    setActiveForm(null);
  };

  // --- 4. IMPORT SIMULATION ---
  const handleImportTrigger = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Simulate parsing the file
    alert(`Simulating import of ${file.name}... (In a real app, this sends the file to the Node backend to parse PDF/Excel)`);
    const dummyImport = [
      { _id: `imp1`, type: "Receipt", accountId: bankAccounts[0]?._id, amount: 25000, reference: "Bulk Import Transfer", date: new Date().toISOString().split('T')[0] }
    ];
    setTransactions([...dummyImport, ...transactions]);
    e.target.value = null; // reset input
  };

  // --- 5. TALLY REPORTING MATH ---
  const filteredTx = transactions.filter(tx => {
    const matchesMonth = filterMonth === "" || tx.date.startsWith(filterMonth);
    const matchesAccount = filterAccount === "All" || tx.accountId === filterAccount;
    return matchesMonth && matchesAccount;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalIn = filteredTx.filter(t => t.type === "Receipt").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalOut = filteredTx.filter(t => t.type === "Payment").reduce((sum, t) => sum + Number(t.amount), 0);
  const closingBalance = totalIn - totalOut;

  const getBankName = (id) => bankAccounts.find(b => b._id === id)?.bankName || "Unknown Account";

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER & TOP ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banking & Cash Ledger</h1>
          <p className="text-gray-500 text-sm mt-1">Manage Receipts, Payments, and Contra Entries</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,.csv,.xlsx,.pdf" className="hidden" />
          
          <button onClick={handleImportTrigger} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm">
            📁 Import Statement
          </button>
          <button onClick={() => setActiveForm(activeForm === "Bank" ? null : "Bank")} className="px-4 py-2 border-2 border-blue-600 text-blue-700 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm">
            🏦 + Add Bank
          </button>
        </div>
      </div>

      {/* VOUCHER ACTION BAR (Receipt, Payment, Contra) */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4">
        <p className="w-full text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Create New Voucher</p>
        <button onClick={() => { setActiveForm("Receipt"); setEditingTxId(null); }} className={`flex-1 py-3 rounded-lg font-bold shadow-sm transition-colors border-2 ${activeForm === "Receipt" ? "bg-green-500 text-white border-green-600" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}`}>
          📥 Receipt (+)
        </button>
        <button onClick={() => { setActiveForm("Payment"); setEditingTxId(null); }} className={`flex-1 py-3 rounded-lg font-bold shadow-sm transition-colors border-2 ${activeForm === "Payment" ? "bg-red-500 text-white border-red-600" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"}`}>
          📤 Payment (-)
        </button>
        <button onClick={() => { setActiveForm("Contra"); setEditingTxId(null); }} className={`flex-1 py-3 rounded-lg font-bold shadow-sm transition-colors border-2 ${activeForm === "Contra" ? "bg-purple-500 text-white border-purple-600" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"}`}>
          🔄 Contra Entry
        </button>
        {activeForm && activeForm !== "Bank" && (
          <button onClick={resetTxForm} className="px-4 font-bold text-gray-500 hover:text-red-500">Cancel</button>
        )}
      </div>

      {/* --- ADD BANK FORM --- */}
      {activeForm === "Bank" && (
        <form onSubmit={handleAddBank} className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-md animate-fade-in">
          <h3 className="font-bold text-blue-800 mb-4 text-lg border-b border-blue-200 pb-2">Create New Bank Ledger</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Bank Name *" className="p-2.5 border rounded-lg focus:outline-blue-500 bg-white" required value={bankFormData.bankName} onChange={(e) => setBankFormData({...bankFormData, bankName: e.target.value})} />
            <input type="text" placeholder="Branch Name *" className="p-2.5 border rounded-lg focus:outline-blue-500 bg-white" required value={bankFormData.branch} onChange={(e) => setBankFormData({...bankFormData, branch: e.target.value})} />
            <input type="text" placeholder="Account Number *" className="p-2.5 border rounded-lg focus:outline-blue-500 font-mono bg-white" required value={bankFormData.accountNumber} onChange={(e) => setBankFormData({...bankFormData, accountNumber: e.target.value})} />
            <input type="text" placeholder="IFSC Code" className="p-2.5 border rounded-lg focus:outline-blue-500 font-mono uppercase bg-white" value={bankFormData.ifsc} onChange={(e) => setBankFormData({...bankFormData, ifsc: e.target.value.toUpperCase()})} />
            <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border md:col-span-4">
              <input type="checkbox" id="primaryBank" className="w-5 h-5 accent-blue-600" checked={bankFormData.isPrimary} onChange={(e) => setBankFormData({...bankFormData, isPrimary: e.target.checked})} />
              <label htmlFor="primaryBank" className="font-medium text-gray-700 cursor-pointer">Set as Primary Bank (Default for transactions)</label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-blue-700 text-white font-bold px-8 py-2 rounded-lg hover:bg-blue-800 shadow-sm">Save Bank Info</button>
          </div>
        </form>
      )}

      {/* --- DYNAMIC TRANSACTION FORM (Changes based on selected tab) --- */}
      {activeForm && activeForm !== "Bank" && (
        <form onSubmit={handleSaveTransaction} className={`p-6 rounded-xl border-2 shadow-md animate-fade-in ${activeForm === "Receipt" ? "bg-green-50 border-green-200" : activeForm === "Payment" ? "bg-red-50 border-red-200" : "bg-purple-50 border-purple-200"}`}>
          <h3 className={`font-bold mb-4 text-lg border-b pb-2 ${activeForm === "Receipt" ? "text-green-800 border-green-200" : activeForm === "Payment" ? "text-red-800 border-red-200" : "text-purple-800 border-purple-200"}`}>
            {editingTxId ? `✏️ Edit ${activeForm}` : `Record ${activeForm} Voucher`}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input type="date" className="p-2.5 border rounded-lg bg-white" required value={txFormData.date} onChange={(e) => setTxFormData({...txFormData, date: e.target.value})} />
            
            {/* The "Primary" Bank Field */}
            <select className="p-2.5 border rounded-lg bg-white font-bold text-gray-700" required value={txFormData.accountId} onChange={(e) => setTxFormData({...txFormData, accountId: e.target.value})}>
              <option value="" disabled>{activeForm === "Receipt" ? "Deposit Into..." : activeForm === "Payment" ? "Pay From..." : "Withdraw From..."}</option>
              {bankAccounts.map(b => <option key={b._id} value={b._id}>{b.bankName}</option>)}
            </select>

            {/* Contra specific: The "To" Bank Field */}
            {activeForm === "Contra" && (
              <select className="p-2.5 border rounded-lg bg-white font-bold text-gray-700" required value={txFormData.contraAccountId} onChange={(e) => setTxFormData({...txFormData, contraAccountId: e.target.value})}>
                <option value="" disabled>Deposit To...</option>
                {bankAccounts.map(b => <option key={b._id} value={b._id} disabled={b._id === txFormData.accountId}>{b.bankName}</option>)}
              </select>
            )}

            <input type="number" placeholder="Amount (₹) *" className={`p-2.5 border rounded-lg bg-white font-bold ${activeForm === "Contra" ? "md:col-span-1" : "md:col-span-2"}`} required value={txFormData.amount} onChange={(e) => setTxFormData({...txFormData, amount: e.target.value})} />
          </div>

          <div className="flex gap-4">
            <input type="text" placeholder={activeForm === "Receipt" ? "Received From (Party Name / Details)" : activeForm === "Payment" ? "Paid To (Party Name / Details)" : "Contra Particulars / Notes"} className="p-2.5 border rounded-lg bg-white w-full" required value={txFormData.reference} onChange={(e) => setTxFormData({...txFormData, reference: e.target.value})} />
            
            <button type="submit" className={`text-white font-bold px-10 py-2.5 rounded-lg shadow-md whitespace-nowrap ${activeForm === "Receipt" ? "bg-green-600 hover:bg-green-700" : activeForm === "Payment" ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}>
              {editingTxId ? "Update" : "Save"} Voucher
            </button>
          </div>
        </form>
      )}

      {/* --- BANK ACCOUNTS SUMMARY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {bankAccounts.map(bank => (
          <div key={bank._id} className={`p-4 rounded-xl border-2 shadow-sm relative overflow-hidden ${bank.isPrimary ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}>
            {bank.isPrimary && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">PRIMARY</div>}
            <h3 className="font-bold text-gray-800 text-lg mb-2">{bank.bankName}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Branch:</span> {bank.branch}</p>
              <p className="font-mono"><span className="font-medium font-sans">A/C:</span> {bank.accountNumber}</p>
              <p className="font-mono"><span className="font-medium font-sans">IFSC:</span> {bank.ifsc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- TALLY STYLE REPORTING SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Report Filters */}
        <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-gray-800 text-lg">Ledger Report</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-600">Month:</label>
              <input type="month" className="p-2 border rounded-md focus:outline-blue-500 text-sm font-medium text-gray-700" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-600">Bank:</label>
              <select className="p-2 border rounded-md focus:outline-blue-500 text-sm font-medium text-gray-700" value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)}>
                <option value="All">All Accounts</option>
                {bankAccounts.map(b => <option key={b._id} value={b._id}>{b.bankName}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Report Summary Math */}
        <div className="grid grid-cols-3 divide-x border-b bg-white">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Inwards (Receipts)</p>
            <p className="text-xl font-bold text-green-600">₹{totalIn.toLocaleString()}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Outwards (Payments)</p>
            <p className="text-xl font-bold text-red-500">₹{totalOut.toLocaleString()}</p>
          </div>
          <div className="p-4 text-center bg-gray-50">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Period Net Balance</p>
            <p className={`text-xl font-bold ${closingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>₹{closingBalance.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Tally Style Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 font-bold text-gray-700 text-sm border-r">Date</th>
                <th className="p-3 font-bold text-gray-700 text-sm border-r w-1/3">Particulars</th>
                <th className="p-3 font-bold text-gray-700 text-sm border-r">Account</th>
                <th className="p-3 font-bold text-gray-700 text-sm text-right border-r">Inwards (₹)</th>
                <th className="p-3 font-bold text-gray-700 text-sm text-right border-r">Outwards (₹)</th>
                <th className="p-3 font-bold text-gray-700 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No transactions found for this period.</td></tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx._id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="p-3 text-gray-600 text-sm border-r whitespace-nowrap">{tx.date}</td>
                    <td className="p-3 font-semibold text-gray-800 border-r">{tx.reference}</td>
                    <td className="p-3 text-gray-600 text-sm border-r">{getBankName(tx.accountId)}</td>
                    <td className="p-3 text-right font-bold text-green-700 border-r bg-green-50/30">
                      {tx.type === "Receipt" ? tx.amount.toLocaleString() : ""}
                    </td>
                    <td className="p-3 text-right font-bold text-red-600 border-r bg-red-50/30">
                      {tx.type === "Payment" ? tx.amount.toLocaleString() : ""}
                    </td>
                    <td className="p-3 text-center">
                       <div className="flex justify-center gap-3">
                         <button onClick={() => handleEdit(tx)} className="text-gray-500 hover:text-gray-800" title="Edit">✏️</button>
                         <button onClick={() => handleDelete(tx._id, tx.contraGroupId)} className="text-red-400 hover:text-red-600" title="Delete">🗑️</button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}