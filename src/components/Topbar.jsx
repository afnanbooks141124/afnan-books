import { Bell, Search, UserCircle, Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="bg-white h-16 border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 text-xl font-bold text-blue-700">
        {/* Hamburger Menu Button - Hidden on desktop (md:hidden) */}
        <button 
          onClick={onMenuClick}
          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        Afnan Books
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-48 md:w-64"
          />
        </div>
        <button className="text-gray-500 hover:text-blue-600"><Bell className="w-5 h-5" /></button>
        <button className="text-gray-500 hover:text-blue-600"><UserCircle className="w-6 h-6" /></button>
      </div>
    </header>
  );
}