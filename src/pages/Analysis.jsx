import { useState } from "react";

// MOCK DATA: Financial Analysis
const summaryStats = {
  revenue: "₹ 12,50,000",
  expenses: "₹ 8,20,000",
  netProfit: "₹ 4,30,000",
  profitMargin: "34.4%"
};

const topExpenses = [
  { id: 1, category: "Purchases/Inventory", amount: "₹ 4,50,000", percentage: 55, color: "bg-blue-500" },
  { id: 2, category: "Employee Salaries", amount: "₹ 2,10,000", percentage: 25, color: "bg-indigo-500" },
  { id: 3, category: "Office Rent", amount: "₹ 80,000", percentage: 10, color: "bg-purple-500" },
  { id: 4, category: "Marketing & Ads", amount: "₹ 45,000", percentage: 5, color: "bg-pink-500" },
  { id: 5, category: "Utilities & Others", amount: "₹ 35,000", percentage: 5, color: "bg-rose-500" },
];

const cashFlowTrend = [
  { month: "Nov", in: 100, out: 80 },
  { month: "Dec", in: 120, out: 90 },
  { month: "Jan", in: 95, out: 85 },
  { month: "Feb", in: 140, out: 95 },
  { month: "Mar", in: 160, out: 110 },
  { month: "Apr", in: 125, out: 82 }, // Current month partial
];

export default function Analysis() {
  const [period, setPeriod] = useState("This Financial Year");

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into your business performance and expenses.</p>
        </div>
        
        <select 
          className="bg-white border border-gray-300 rounded-md text-sm px-4 py-2 focus:outline-none focus:border-blue-500 font-medium shadow-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>This Month</option>
          <option>Last Quarter</option>
          <option>This Financial Year</option>
          <option>Last Financial Year</option>
        </select>
      </div>

      {/* TOP SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.revenue}</h3>
          <p className="text-xs text-green-600 mt-2 font-medium">↑ 12% from last period</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.expenses}</h3>
          <p className="text-xs text-red-500 mt-2 font-medium">↑ 5% from last period</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Net Profit</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">{summaryStats.netProfit}</h3>
          <p className="text-xs text-green-600 mt-2 font-medium">↑ 18% from last period</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <p className="text-sm font-medium text-gray-300">Net Profit Margin</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{summaryStats.profitMargin}</h3>
          <p className="text-xs text-blue-300 mt-2 font-medium">Healthy Indicator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EXPENSE BREAKDOWN (CSS Visualization) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Top Expenses Breakdown</h2>
          
          <div className="flex flex-col gap-5">
            {topExpenses.map((expense) => (
              <div key={expense.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{expense.category}</span>
                  <span className="font-bold text-gray-800">{expense.amount}</span>
                </div>
                {/* CSS Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 flex overflow-hidden">
                  <div 
                    className={`${expense.color} h-2.5 rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{expense.percentage}% of total expenses</p>
              </div>
            ))}
          </div>
        </div>

        {/* CASH FLOW TREND (Simulated CSS Bar Chart) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Cash Flow Trend (6 Months)</h2>
            <div className="flex gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm"></div> In</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Out</span>
            </div>
          </div>

          {/* CSS Bar Chart Area */}
          <div className="flex-1 flex items-end justify-between gap-2 pt-6 border-b border-gray-200 pb-2 h-48">
            {cashFlowTrend.map((data, index) => (
              <div key={index} className="flex flex-col justify-end items-center gap-1 w-full group">
                <div className="flex gap-1 items-end w-full justify-center h-full">
                  {/* Cash In Bar */}
                  <div 
                    className="w-1/3 max-w-[20px] bg-green-400 rounded-t-sm group-hover:bg-green-500 transition-colors relative" 
                    style={{ height: `${(data.in / 200) * 100}%` }}
                    title={`Cash In: ${data.in}k`}
                  ></div>
                  {/* Cash Out Bar */}
                  <div 
                    className="w-1/3 max-w-[20px] bg-red-400 rounded-t-sm group-hover:bg-red-500 transition-colors relative" 
                    style={{ height: `${(data.out / 200) * 100}%` }}
                    title={`Cash Out: ${data.out}k`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}