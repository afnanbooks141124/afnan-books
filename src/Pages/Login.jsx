import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // LINE 18: Reaching out to your LIVE cloud server
      const response = await fetch("https://afnan-books.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // --- NEW 404 DETECTOR ---
      if (response.status === 404) {
        setError("Error 404: The cloud backend is currently updating. Please wait 60 seconds for Render to finish deploying, then try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Unlock the front door!
        onLogin(true); 
        navigate("/"); 
      } else {
        // Show the exact error the backend sent (e.g., "Invalid password")
        setError(data.error || "Login failed. Please verify your credentials.");
      }
    } catch (err) {
      setError("Cannot connect to the cloud server. Please ensure you are online.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 fixed inset-0 z-50">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 m-4">
        
        {/* Left Side - Branding */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-700 to-indigo-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Afnan Books</h1>
            <p className="text-blue-200 font-medium tracking-wide text-sm uppercase">Cloud ERP System</p>
          </div>
          
          <div className="mt-12 relative z-10">
            <h2 className="text-2xl font-bold mb-4">Secure Cloud Access.</h2>
            <ul className="space-y-3 text-blue-100 text-sm font-medium">
              <li className="flex items-center gap-2"><span>✅</span> Live Database Sync</li>
              <li className="flex items-center gap-2"><span>✅</span> Encrypted Authentication</li>
              <li className="flex items-center gap-2"><span>✅</span> Real-time Financials</li>
              <li className="flex items-center gap-2"><span>✨</span> AI Copilot Enabled</li>
            </ul>
          </div>
          
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 mt-2">Enter your authorized credentials to access the ERP.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 text-gray-800 font-medium"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 text-gray-800 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-lg transition-colors shadow-lg mt-4 flex justify-center items-center ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}`}
            >
              {loading ? "Authenticating with Database..." : "Secure Login"}
            </button>
          </form>
          
          <p className="text-center text-gray-400 text-xs mt-10">
            Powered by MongoDB Atlas • Vercel • Render
          </p>
        </div>
      </div>
    </div>
  );
}