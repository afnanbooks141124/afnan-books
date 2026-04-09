import { useState, useEffect } from "react";
import { Users, Building2, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ companies: 0, users: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, Ag Agro!</h1>
          <p className="text-gray-600">I'm here to help you every step of the way. If you need any assistance, feel free to reach out!</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm whitespace-nowrap">
          Book a Demo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-blue-500" />} title="Total Users" value={stats.users} />
        <StatCard icon={<Building2 className="w-6 h-6 text-indigo-500" />} title="Total Companies" value={stats.companies} />
        <StatCard icon={<CheckCircle2 className="w-6 h-6 text-green-500" />} title="Completed Tasks" value="12" />
        <StatCard icon={<Clock className="w-6 h-6 text-orange-500" />} title="Pending Tasks" value="3" />
      </div>

      {/* ... The rest of your training sessions section remains the same ... */}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm hover:shadow-md transition">
      <div className="p-3 bg-gray-50 rounded-lg border">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}