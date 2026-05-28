import { useState, useEffect } from "react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("pnl"); // 'pnl', 'tax', or 'clients'
  const [loading, setLoading] = useState(true);
  
  // Report Data States
  const [salesData, setSalesData] = useState([]);
  const [bankingData, setBankingData] = useState([]);

  // FETCH DATA
  useEffect(() => {
    const loadReportData = () => {
      // 1. Load Sales (Revenue & Tax)
      const localSales = JSON.parse(localStorage.getItem("offlineSales")) || [];
      setSalesData(localSales);

      // 2. Load Banking (Expenses)
      // Since we didn't add localStorage to Banking yet, we use intelligent dummy data mixed with real sales
      const dummyExpenses = [
        { type: "Expense", desc: "Office Rent", amount: 15000, date: "2026-05-01" },
        { type: "Expense", desc: "Internet & Utilities", amount: 2500, date: "2026-05-05" },
        { type: "Expense", desc: "Software Subscriptions", amount: 4200, date: "2026-05-10" },
        { type: "Expense", desc: "Staff Salaries", amount: 45000, date: "2026-04-30" }
      ];
      setBankingData(dummyExpenses);
      
      setLoading(false);
    };

    loadReportData();
  }, []);

  // --- MATH CALCULATION FOR PROFIT & LOSS ---
  const totalRevenue = salesData.reduce((sum, s) => sum + Number(s.amount), 0) || 125000; // Fallback if no sales
  const totalExpenses = bankingData.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // --- MATH CALCULATION FOR TAX (GST) ---
  // Assuming a standard 18% GST was applied to the Grand Total of sales
  const totalTaxableValue = totalRevenue / 1.18; 
  const totalGSTCollected = totalRevenue - totalTaxableValue;
  const cgst = totalGSTCollected / 2;
  const sgst = totalGSTCollected / 2;

  // --- ACTIONS ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b pb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate P&L, Tax Liability, and Business Insights</p>
        </div>
        <button onClick={handlePrint} className="px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors border-2 border-gray-300 text-gray-700 hover:bg-gray-100 bg-white flex items-center gap-2">
          🖨️ Print Report
        </button>
      </div>

      {/* REPORT TABS (Hidden during print) */}
      <div className="flex gap-2 border-b border-gray-200 mb-6 print:hidden overflow-x-auto">
        <button onClick={() => setActiveTab("pnl")} className={`px-6 py-3 font-bold text-sm border-b-4 transition-colors whitespace-nowrap ${activeTab === "pnl" ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
          📈 Profit & Loss
        </button>
        <button onClick={() => setActiveTab("tax")} className={`px-6 py-3 font-bold text-sm border-b-4 transition-colors whitespace-nowrap ${activeTab === "tax" ? "border-orange-500 text-orange-700 bg-orange-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
          🏛️ GST Liability
        </button>
        <button onClick={() => setActiveTab("clients")} className={`px-6 py-3 font-bold text-sm border-b-4 transition-colors whitespace-nowrap ${activeTab === "clients" ? "border-purple-600 text-purple-700 bg-purple-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
          🏢 Client Revenue
        </button>
      </div>

      {/* --- REPORT CONTENT AREA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print:border-none print:shadow-none print:p-0">
        
        {/* REPORT 1: PROFIT & LOSS */}
        {activeTab === "pnl" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-widest">Profit & Loss Statement</h2>
              <p className="text-gray-500">For the period ending May 2026</p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Income Section */}
              <div className="mb-8">
                <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-2 mb-4 text-lg">1. Operating Income</h3>
                <div className="flex justify-between items-center py-2 text-gray-700">
                  <span>Sales Revenue (Billed)</span>
                  <span className="font-mono">₹{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center py-3 mt-2 bg-blue-50 px-4 rounded-lg font-bold text-blue-900">
                  <span>Total Gross Income</span>
                  <span className="font-mono">₹{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* Expense Section */}
              <div className="mb-8">
                <h3 className="font-bold text-red-700 border-b border-red-200 pb-2 mb-4 text-lg">2. Operating Expenses</h3>
                {bankingData.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-gray-700 border-b border-gray-50 border-dashed">
                    <span>{exp.desc}</span>
                    <span className="font-mono">₹{exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3 mt-4 bg-red-50 px-4 rounded-lg font-bold text-red-900">
                  <span>Total Expenses</span>
                  <span className="font-mono">₹{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* Net Profit Section */}
              <div className={`flex justify-between items-center py-4 px-6 rounded-xl border-2 ${netProfit >= 0 ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div>
                  <span className="block text-sm font-bold opacity-75 uppercase tracking-wider">Net Profit / (Loss)</span>
                  <span className="block text-xs mt-1">Margin: {profitMargin}%</span>
                </div>
                <span className="text-3xl font-black font-mono">₹{netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 2: TAX LIABILITY */}
        {activeTab === "tax" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-widest">GST Liability Summary</h2>
              <p className="text-gray-500">Output Tax Calculated on Sales (May 2026)</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Billed Value</p>
                  <p className="text-2xl font-black text-gray-800">₹{totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Taxable Value</p>
                  <p className="text-2xl font-black text-blue-800">₹{totalTaxableValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 text-center shadow-sm">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Total GST Owed</p>
                  <p className="text-2xl font-black text-orange-700">₹{totalGSTCollected.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-100 p-4 border-b font-bold text-gray-700">Tax Breakdown (Intra-State)</div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 text-gray-600 font-medium">CGST (9%)</td>
                        <td className="p-4 text-right font-mono font-bold text-gray-800">₹{cgst.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-gray-600 font-medium">SGST (9%)</td>
                        <td className="p-4 text-right font-mono font-bold text-gray-800">₹{sgst.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-gray-600 font-medium">IGST (18%)</td>
                        <td className="p-4 text-right font-mono font-bold text-gray-800">₹0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 3: CLIENT REVENUE */}
        {activeTab === "clients" && (
          <div className="animate-fade-in">
             <div className="text-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-widest">Client Revenue Ledger</h2>
              <p className="text-gray-500">Top performing clients by billed amount</p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-50 border-b-2 border-purple-200">
                  <th className="p-4 font-bold text-purple-800">Client Name</th>
                  <th className="p-4 font-bold text-purple-800 text-center">Invoices Generated</th>
                  <th className="p-4 font-bold text-purple-800 text-right">Total Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {salesData.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center text-gray-500">No sales data available to generate report.</td></tr>
                ) : (
                  salesData.map((sale, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-800">{sale.clientName}</td>
                      <td className="p-4 text-center text-gray-600">1</td>
                      <td className="p-4 text-right font-mono font-bold text-gray-700">₹{Number(sale.amount).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}