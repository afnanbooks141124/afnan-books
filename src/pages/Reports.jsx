import { 
  LineChart, Receipt, ArrowRightLeft, Package, Wallet, 
  FolderMinus, FileText, BookOpen, ShoppingCart, IndianRupee, 
  FileSpreadsheet, User, TrendingUp, Map, PieChart
} from "lucide-react";

export default function Reports() {
  // We split the data into left and right columns to match your screenshot
  const leftReports = [
    { name: "Sales - Credit Note", icon: <LineChart className="w-5 h-5 text-gray-500" /> },
    { name: "Payment-Receipt", icon: <Receipt className="w-5 h-5 text-gray-500" /> },
    { name: "S/P-Order", icon: <ArrowRightLeft className="w-5 h-5 text-gray-500" /> },
    { name: "Items", icon: <Package className="w-5 h-5 text-gray-500" /> },
    { name: "Bank/Cash", icon: <Wallet className="w-5 h-5 text-gray-500" /> },
    { name: "Expenses", icon: <FolderMinus className="w-5 h-5 text-gray-500" /> },
    { name: "Ledger Report", icon: <FileText className="w-5 h-5 text-gray-500" /> },
    { name: "Day Book", icon: <BookOpen className="w-5 h-5 text-gray-500" /> },
  ];

  const rightReports = [
    { name: "Purchase - Debit Note", icon: <ShoppingCart className="w-5 h-5 text-gray-500" /> },
    { name: "Outstanding", icon: <IndianRupee className="w-5 h-5 text-gray-500" /> },
    { name: "Delivery Note", icon: <FileSpreadsheet className="w-5 h-5 text-gray-500" /> },
    { name: "Party", icon: <User className="w-5 h-5 text-gray-500" /> },
    { name: "Profit Loss", icon: <TrendingUp className="w-5 h-5 text-gray-500" /> },
    { name: "Balance Sheet", icon: <FileText className="w-5 h-5 text-gray-500" /> },
    { name: "Map", icon: <Map className="w-5 h-5 text-gray-500" /> },
  ];

  // A reusable component for the report buttons
  const ReportCard = ({ item }) => (
    <button className="flex items-center gap-4 w-full bg-white p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all text-left group">
      <div className="group-hover:text-blue-600 transition-colors">
        {item.icon}
      </div>
      <span className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">
        {item.name}
      </span>
    </button>
  );

  return (
    <div className="space-y-4">
      
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded">
            <PieChart className="text-blue-600 w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Reports</h1>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column */}
        <div className="space-y-3">
          {leftReports.map((item, index) => (
            <ReportCard key={index} item={item} />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightReports.map((item, index) => (
            <ReportCard key={index} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
}