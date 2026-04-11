import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <-- IMPORT THIS
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ADD THE TOASTER HERE */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          <Outlet /> 
        </main>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
