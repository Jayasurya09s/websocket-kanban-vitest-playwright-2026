import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/http";
import socket from "../api/socket";
import { FaSpinner } from "react-icons/fa";

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
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    return () => {
      socket.off("sync:tasks", handleSync);
    };
  }, []);

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
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${
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