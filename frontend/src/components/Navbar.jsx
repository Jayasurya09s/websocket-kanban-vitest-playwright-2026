import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import socket from "../api/socket";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      pathname === path ? "text-white" : "text-slate-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50">
      <div className="glass-panel border-b border-white/5">
        <div className="w-[96%] max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/dashboard" className="text-lg font-semibold text-white">
              Kanban<span className="gradient-text">Flow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Board
              </Link>
              <Link to="/analytics" className={linkClass("/analytics")}>
                Analytics
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                ></span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/80 to-cyan-400/80 flex items-center justify-center font-semibold text-white text-sm">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>

              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="btn btn-secondary text-xs sm:text-sm px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-3 pb-4 pt-2 border-t border-white/5">
            <Link to="/dashboard" className="btn btn-secondary text-xs flex-1 justify-center">
              Board
            </Link>
            <Link to="/analytics" className="btn btn-secondary text-xs flex-1 justify-center">
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
