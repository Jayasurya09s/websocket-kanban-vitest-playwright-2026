import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/http";
import socket from "../api/socket";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ACTION_LABELS = {
  TASK_CREATED: "Created",
  TASK_UPDATED: "Updated",
  TASK_MOVED: "Moved",
  TASK_DELETED: "Deleted",
  ATTACHMENT_ADDED: "Added attachment",
};

const ACTION_COLORS = {
  TASK_CREATED: "bg-green-500/15 text-green-300 border-green-500/30",
  TASK_UPDATED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  TASK_MOVED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  TASK_DELETED: "bg-red-500/15 text-red-300 border-red-500/30",
  ATTACHMENT_ADDED: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

const ACTION_ICONS = {
  TASK_CREATED: "✨",
  TASK_UPDATED: "✏️",
  TASK_MOVED: "➡️",
  TASK_DELETED: "🗑️",
  ATTACHMENT_ADDED: "📎",
};

export default function ActivityPanel() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    const handleSync = (tasks) => {
      const boardId = tasks?.[0]?.boardId;

      if (!boardId) {
        setLogs([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      API.get(`/activity/board/${boardId}`)
        .then((res) => setLogs(res.data))
        .catch((err) => console.error("Activity fetch error:", err))
        .finally(() => setIsLoading(false));
    };

    setIsLoading(true);
    socket.emit("sync:tasks");
    socket.on("sync:tasks", handleSync);

    const handleOnline = (payload) => {
      if (!payload || typeof payload === "number") return;
      const users = Array.isArray(payload.users) ? payload.users : [];
      const next = new Map();
      users.forEach((user) => {
        if (user?.socketId) {
          next.set(user.socketId, user.username || user.email || "Guest");
        }
      });
      setOnlineUsers(next);
    };

    socket.on("users:online", handleOnline);

    return () => {
      socket.off("sync:tasks", handleSync);
      socket.off("users:online", handleOnline);
    };
  }, []);

  const resolveActor = (log) => {
    const performer = log?.performedBy;
    if (typeof performer === "string") {
      if (performer.includes("@")) return performer;
      if (performer === socket.id && user?.username) return user.username;
      const mapped = onlineUsers.get(performer);
      return mapped || "Guest";
    }
    return performer?.username || performer?.email || "Guest";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 h-full lg:max-h-[calc(100vh-220px)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Activity</p>
          <h3 className="text-lg font-semibold text-white">Recent updates</h3>
        </div>
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="text-emerald-300" />
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 flex flex-col items-center gap-4"
            >
              <div className="text-4xl opacity-30">📋</div>
              <p className="text-sm text-slate-400">No activity yet</p>
            </motion.div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                layout
                className="glass-panel-hover p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl mt-0.5">
                    {ACTION_ICONS[log.action] || "•"}
                  </div>
                  <div className="flex-1 min-w-0">
                    {log.metadata?.title && (
                      <p className="font-semibold text-white text-sm mb-1 truncate">
                        {log.metadata.title}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      {ACTION_LABELS[log.action] || log.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Name: {resolveActor(log)}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${
                      ACTION_COLORS[log.action] ||
                      "bg-gray-500/15 text-gray-300 border-gray-500/30"
                    }`}
                  >
                    {log.action.split("_")[1]?.[0] || "·"}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}