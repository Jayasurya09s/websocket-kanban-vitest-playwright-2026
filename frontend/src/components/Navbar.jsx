import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../api/socket";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
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

  return (
    <div className="h-16 flex items-center justify-between px-6 glass border-b border-white/10">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
        <div className="text-lg font-semibold text-indigo-200">KanbanAI Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span
            className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-red-400"}`}
          ></span>
          {isConnected ? "Live sync" : "Reconnecting"}
        </div>

        <div className="text-sm text-gray-300">{user?.username || "User"}</div>

        <div className="w-9 h-9 rounded-full bg-indigo-500/80 flex items-center justify-center font-bold">
          {user?.username?.[0] || "U"}
        </div>

        <button
          onClick={() => {
            logout();
            nav("/");
          }}
          className="px-4 py-2 bg-red-500/70 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
