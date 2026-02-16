import { Link, useLocation } from "react-router-dom";
import { FaTasks, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
  const { pathname } = useLocation();

  const item = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition ${
        pathname === to ? "bg-indigo-600/70 text-white" : "hover:bg-white/5 text-slate-300"
      }`}
    >
      {icon} {label}
    </Link>
  );

  return (
    <div className="w-64 h-screen glass border-r border-white/10 p-6 flex flex-col">
      <div className="text-xl font-bold text-indigo-300 mb-10">KanbanAI</div>

      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4">Workspace</div>
      {item("/dashboard", <FaTasks />, "Board")}
      {item("/analytics", <FaChartBar />, "Analytics")}

      <div className="mt-auto glass-strong rounded-2xl p-4 border border-white/10">
        <p className="text-xs text-slate-400">Realtime mode</p>
        <p className="mt-2 text-sm text-indigo-200">Active</p>
      </div>
    </div>
  );
}
