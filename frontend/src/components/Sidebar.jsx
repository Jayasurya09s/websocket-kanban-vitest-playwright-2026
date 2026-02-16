import { Link, useLocation } from "react-router-dom";
import { FaTasks, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
  const { pathname } = useLocation();

  const item = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
        pathname === to 
          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30" 
          : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <aside className="hidden lg:flex w-64 glass-card border-r border-white/5 p-6 flex-col">
      <div className="mb-10">
        <div className="text-2xl font-bold">
          <span className="text-gradient">Kanban</span>
          <span className="text-white">Flow</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Workspace</p>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-4">
          Navigation
        </div>
        {item("/dashboard", <FaTasks />, "Board")}
        {item("/analytics", <FaChartBar />, "Analytics")}
      </nav>

      <div className="mt-auto glass-card p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <p className="text-xs font-medium text-gray-400">Status</p>
        </div>
        <p className="text-sm font-semibold text-gradient">Connected</p>
      </div>
    </aside>
  );
}
