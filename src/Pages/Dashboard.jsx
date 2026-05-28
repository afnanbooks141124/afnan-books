import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState({ totalRevenue: 0, pendingPayments: 0, bankBalance: 0, totalClients: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // COLORS FOR PIE CHART
  const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green (Paid), Yellow (Pending), Red (Overdue)

  // FETCH ALL DATA FROM LIVE BACKEND
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesRes, clientsRes] = await Promise.all([
          fetch("https://afnan-books.onrender.com/api/sales"),
          fetch("https://afnan-books.onrender.com/api/companies")
        ]);

        if (salesRes.ok && clientsRes.ok) {
          const sales = await salesRes.json();
          const clients = await clientsRes.json();

          // 1. Calculate Top Stats
          const revenue = sales.filter(s => s.status === "Paid").reduce((sum, s) => sum + Number(s.amount), 0);
          const pending = sales.filter(s => s.status === "Pending").reduce((sum, s) => sum + Number(s.amount), 0);
          const overdue = sales.filter(s => s.status === "Overdue").reduce((sum, s) => sum + Number(s.amount), 0);

          setStats({ totalRevenue: revenue, pendingPayments: pending, bankBalance: 245000, totalClients: clients.length });
          setRecentActivity(sales.slice(0, 5));

          // 2. Prepare Data for Pie Chart
          setPieData([
            { name: 'Paid', value: revenue },
            { name: 'Pending', value: pending },
            { name: 'Overdue', value: overdue }
          ]);

          // 3. Prepare Data for Area Chart (Grouping sales by Date)
          // For a real app, you group by month. Here we group by exact date for the demo.
          const groupedSales = sales.reduce((acc, sale) => {
            const date = sale.date || "Unknown";
            if (!acc[date]) acc[date] = 0;
            if (sale.status === "Paid") acc[date] += Number(sale.amount);
            return acc;
          }, {});

          const formattedChartData = Object.keys(groupedSales).map(date => ({
            name: date,
            Revenue: groupedSales[date]
          })).reverse(); // Reverse to show oldest to newest left-to-right

          setChartData(formattedChartData.length > 0 ? formattedChartData : [{ name: "No Data", Revenue: 0 }]);
        }
      } catch (error) {
        console.error("Failed to fetch live data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Quick Action Helper
  const ActionButton = ({ icon, label, path, color }) => (
    <button onClick={() => navigate(path)} className={`flex flex-col items-center justify-center p-5 rounded-xl border shadow-sm hover:shadow-md transition-all bg-white hover:border-${color}-400 group`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="font-bold text-gray-700 text-sm">{label}</span>
    </button>
  );

  return (
    <div className="w-full space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">ERP Control Center</h1>
          <p className="text-gray-500 font-medium mt-1">Live financial analytics connected to MongoDB.</p>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-transform">
          <p className="text-blue-100 font-semibold mb-1 opacity-90">Total Revenue Collected</p>
          <h2 className="text-3xl font-black mb-4">₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 p-4 text-orange-100 text-5xl">⏳</div>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Pending Invoices</p>
          <h2 className="text-3xl font-black text-gray-800 mb-2">₹{stats.pendingPayments.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 right-0 p-4 text-teal-100 text-5xl">🏦</div>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Estimated Bank Balance</p>
          <h2 className="text-3xl font-black text-gray-800 mb-2">₹{stats.bankBalance.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 right-0 p-4 text-purple-100 text-5xl">🏢</div>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Active Client Roster</p>
          <h2 className="text-3xl font-black text-gray-800 mb-2">{stats.totalClients}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CHARTS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Area Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><span>📈</span> Revenue Growth (Paid Invoices)</h3>
            <div className="h-72 w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Loading Chart Data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="Revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
               <h3 className="font-bold text-gray-800 flex items-center gap-2"><span>📅</span> Recent Live Sales</h3>
             </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200">
                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Client / Invoice</th>
                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Amount (₹)</th>
                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((sale, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 text-gray-600 text-sm font-medium">{sale.date}</td>
                      <td className="p-4 font-bold text-gray-800">{sale.clientName} <span className="text-xs text-gray-400 font-mono ml-2">({sale.invoiceNumber})</span></td>
                      <td className="p-4 text-right font-black text-gray-700">₹{Number(sale.amount).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        {sale.status === "Paid" && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold">Paid</span>}
                        {sale.status === "Pending" && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-xs font-bold">Pending</span>}
                        {sale.status === "Overdue" && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-bold">Overdue</span>}
                      </td>
                    </tr>
                  ))}
                  {recentActivity.length === 0 && (<tr><td colSpan="4" className="p-8 text-center text-gray-500">No live sales recorded yet.</td></tr>)}
                </tbody>
              </table>
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & PIE CHART */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon="📄" label="New Invoice" path="/invoices" color="blue" />
              <ActionButton icon="💰" label="Banking" path="/banking" color="green" />
              <ActionButton icon="🏢" label="Clients" path="/clients" color="purple" />
              <ActionButton icon="📊" label="Reports" path="/reports" color="orange" />
            </div>
          </div>

          {/* Payment Status Pie Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><span>🎯</span> Payment Status</h3>
             <p className="text-xs text-gray-500 mb-4">Distribution of total invoiced amounts</p>
             <div className="h-64 w-full">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Loading...</div>
                ) : pieData.reduce((a,b)=>a+b.value, 0) === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No invoice data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}