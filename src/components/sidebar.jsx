import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, FileText, PieChart, Briefcase, 
  Wallet, ShoppingCart, BarChart2, Database, BookOpen, 
  ChevronDown, ChevronRight, X
} from "lucide-react";

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  // State to track which dropdown menus are open
  const [openMenus, setOpenMenus] = useState({ dataEntry: false });

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Client & Company", path: "/company", icon: <Briefcase size={20} /> },
    { name: "GST Manager", path: "/gst-manager", icon: <FileText size={20} /> },
    { name: "User & Roles", path: "/users", icon: <Users size={20} /> },
    
    // Here is our new Sub-menu Structure!
    { 
      name: "Data Entry", 
      id: "dataEntry",
      icon: <Database size={20} />,
      subItems: [
        { name: "Banking", path: "/banking", icon: <Wallet size={16} /> },
        { name: "Sales", path: "/sales", icon: <ShoppingCart size={16} /> },
      ]
    },
    
    { name: "Master", path: "/master", icon: <BookOpen size={20} /> },
    { name: "Analysis", path: "/analysis", icon: <BarChart2 size={20} /> },
    { name: "Reports", path: "/reports", icon: <PieChart size={20} /> },
  ];

  return (
    <aside className={`
      bg-white border-r min-h-screen flex flex-col absolute md:relative z-50 w-64 transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      {/* Mobile Close Button */}
      <div className="flex justify-end p-4 md:hidden border-b">
        <button onClick={closeSidebar} className="text-gray-500 hover:text-red-500">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Check if it's a normal link or a dropdown menu
            if (item.subItems) {
              const isSubMenuOpen = openMenus[item.id];
              // Check if we are currently on one of the sub-pages
              const isChildActive = item.subItems.some(sub => location.pathname === sub.path);

              return (
                <li key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors
                      ${isChildActive ? "text-blue-700 bg-blue-50/50" : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon} {item.name}
                    </div>
                    {isSubMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {/* The actual sub-items */}
                  {isSubMenuOpen && (
                    <ul className="bg-gray-50/50 py-2">
                      {item.subItems.map((sub) => {
                        const isActive = location.pathname === sub.path;
                        return (
                          <li key={sub.name}>
                            <Link
                              to={sub.path}
                              onClick={closeSidebar} // Close sidebar on mobile after clicking
                              className={`flex items-center gap-3 pl-12 pr-6 py-2.5 text-sm font-medium transition-colors
                                ${isActive ? "text-blue-700 font-bold border-r-4 border-blue-700" : "text-gray-500 hover:text-blue-700"}`}
                            >
                              {sub.icon} {sub.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Normal single links
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={closeSidebar} // Close sidebar on mobile after clicking
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                    ${isActive ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"}`}
                >
                  {item.icon} {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}