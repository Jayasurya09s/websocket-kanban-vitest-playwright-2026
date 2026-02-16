import { useEffect, useState } from "react";
import socket from "../api/socket";

export default function LiveUsersBadge({ compact = false }) {
  const [count, setCount] = useState(1);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    const handleOnline = (value) => {
      if (typeof value === "number") {
        setCount(value);
        return;
      }

      if (value && typeof value === "object") {
        const nextUsers = Array.isArray(value.users) ? value.users : [];
        setUsers(nextUsers);
        setCount(typeof value.count === "number" ? value.count : nextUsers.length);
      }
    };

    socket.on("users:online", handleOnline);

    return () => {
      socket.off("users:online", handleOnline);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`glass-panel-hover px-3 py-1.5 text-xs text-slate-200 ${
          compact ? "" : "rounded-full"
        }`}
      >
        {count} {count === 1 ? "person" : "people"} live
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 glass-panel p-4 border border-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-500">Online now</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {users.length === 0 ? (
              <span className="text-xs text-slate-400">No profiles yet</span>
            ) : (
              users.map((user) => {
                const name = user?.username || user?.email || "Guest";
                const initial = name?.[0]?.toUpperCase() || "G";
                return (
                  <button
                    type="button"
                    key={user?.socketId || user?.userId || name}
                    onClick={() => setSelectedName(name)}
                    className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-200 flex items-center justify-center text-xs font-semibold"
                    title={name}
                  >
                    {initial}
                  </button>
                );
              })
            )}
          </div>
          {selectedName && (
            <div className="text-xs text-slate-300 mt-3">
              Name: {selectedName}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
