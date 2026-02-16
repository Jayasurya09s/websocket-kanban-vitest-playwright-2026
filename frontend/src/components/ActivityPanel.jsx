import { useEffect, useState } from "react";
import API from "../api/http";
import socket from "../api/socket";
import { FaSpinner } from "react-icons/fa";

const ACTION_LABELS = {
  TASK_CREATED: "Created",
  TASK_UPDATED: "Updated",
  TASK_MOVED: "Moved",
  TASK_DELETED: "Deleted",
  ATTACHMENT_ADDED: "Added attachment"
};

const ACTION_COLORS = {
  TASK_CREATED: "bg-emerald-500/20 text-emerald-200",
  TASK_UPDATED: "bg-blue-500/20 text-blue-200",
  TASK_MOVED: "bg-purple-500/20 text-purple-200",
  TASK_DELETED: "bg-red-500/20 text-red-200",
  ATTACHMENT_ADDED: "bg-indigo-500/20 text-indigo-200"
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
    <div className="glass rounded-2xl p-6 w-[350px] h-full overflow-hidden flex flex-col border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-indigo-200 font-semibold">Activity</h3>
        {isLoading && <FaSpinner className="animate-spin text-indigo-400" />}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {logs.length === 0 ? (
          <div className="text-sm text-slate-400 text-center py-4">
            No activity yet
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="glass-strong rounded-xl p-3 border border-white/5 hover:border-white/10 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-300">
                    {log.metadata?.title && (
                      <p className="truncate font-medium">{log.metadata.title}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {ACTION_LABELS[log.action] || log.action}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    ACTION_COLORS[log.action] || "bg-slate-500/20 text-slate-300"
                  }`}
                >
                  {log.action.split("_")[1]?.[0] || "·"}
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-2">
                {new Date(log.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
