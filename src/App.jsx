import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar"; 
import Login from "./Pages/Login";

import Dashboard from "./Pages/Dashboard";
import Clients from "./Pages/ClientCompany";
import GSTManager from "./Pages/GSTManager";
import UserRoles from "./Pages/UserRoles";
import Banking from "./Pages/Banking";
import Transactions from "./Pages/Transactions";
import LedgerMaster from "./Pages/LedgerMaster";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <Router>
        <Login onLogin={setIsAuthenticated} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen font-sans">
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
             <div className="flex-1"></div>
             <div className="flex items-center gap-4">
                <span className="text-sm font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                  Suvit is Now Vyapar TaxOne
                </span>
                <button 
                  onClick={() => setIsAuthenticated(false)} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-1.5 px-4 rounded transition-colors border border-slate-300"
                >
                  Logout
                </button>
             </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/gst-manager" element={<GSTManager />} />
              <Route path="/users" element={<UserRoles />} />
              <Route path="/bulk-upload" element={<Banking />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/master" element={<LedgerMaster />} />
            </Routes>
          </main>
          
        </div>
      </div>
    </Router>
  );
}

export default App;