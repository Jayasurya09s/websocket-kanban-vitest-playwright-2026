import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";
import socket from "../api/socket";
import { FaTrash, FaPaperclip, FaPen, FaFolderOpen } from "react-icons/fa";
import AttachmentsModal from "./AttachmentsModal";
import { useAuth } from "../context/AuthContext";

const PRIORITY_COLOR = {
  low: "bg-sky-500/10 text-sky-200 border-sky-500/20",
  medium: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  high: "bg-rose-500/10 text-rose-200 border-rose-500/20",
};

const CATEGORY_BADGE = {
  bug: "bg-rose-500/10 text-rose-200 border-rose-500/20",
  feature: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
  enhancement: "bg-indigo-500/10 text-indigo-200 border-indigo-500/20",
};

export default function TaskCard({ task, openUpload, openEdit, moveCard, commitReorder }) {
  const { user } = useAuth();
  const [showFiles, setShowFiles] = useState(false);
  const actor = user ? { id: user._id, username: user.username, email: user.email } : null;
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "TASK",
    item: { id: task._id, column: task.column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item) => {
      if (!item || item.id === task._id) return;
      if (item.column !== task.column) return;
      moveCard?.(item.id, task._id, task.column);
    },
    drop: (item) => {
      if (!item) return;
      if (item.column !== task.column) {
        socket.emit("task:move", { taskId: item.id, column: task.column, user: actor });
        return;
      }
      commitReorder?.(task.column);
    }
  });

  return (
    <motion.div
      ref={(node) => preview(drop(node))}
      whileHover={{ y: -4 }}
      className="glass-panel-hover p-4 group"
      style={{
        opacity: isDragging ? 0.4 : 1,
        padding: "18px",
        borderRadius: "16px",
        background: "linear-gradient(160deg, rgba(15, 23, 42, 0.78), rgba(10, 15, 28, 0.9))",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 18px 45px rgba(2, 6, 23, 0.45)",
      }}
    >
      <div
        ref={drag}
        className="cursor-grab active:cursor-grabbing"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}
      >
        <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3" style={{ gap: "8px", marginBottom: "12px" }}>
        <span
          className={`text-[11px] px-2 py-1 rounded-full border font-semibold ${
            PRIORITY_COLOR[task.priority || "medium"] || PRIORITY_COLOR.medium
          }`}
          style={{ letterSpacing: "0.02em" }}
        >
          {(task.priority || "medium").charAt(0).toUpperCase() + (task.priority || "medium").slice(1)}
        </span>

        <span
          className={`text-[11px] px-2 py-1 rounded-full border font-semibold ${
            CATEGORY_BADGE[task.category || "feature"] || CATEGORY_BADGE.feature
          }`}
          style={{ letterSpacing: "0.02em" }}
        >
          {(task.category || "feature").charAt(0).toUpperCase() + (task.category || "feature").slice(1)}
        </span>

        {task.attachments && task.attachments.length > 0 && (
          <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
            <FaPaperclip className="w-2.5 h-2.5" />
            {task.attachments.length}
          </span>
        )}

        {(task.labels || []).slice(0, 2).map((label) => (
          <span
            key={label}
            className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-slate-200 bg-white/5"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openUpload(task)}
          className="flex-1 min-w-30 btn btn-secondary text-xs py-2 justify-center"
          style={{ padding: "8px 12px", borderRadius: "12px" }}
        >
          <FaPaperclip className="w-3 h-3" />
          <span>Attach</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: task.attachments?.length ? 1.05 : 1 }}
          whileTap={{ scale: task.attachments?.length ? 0.95 : 1 }}
          onClick={() => setShowFiles(true)}
          disabled={!task.attachments || task.attachments.length === 0}
          className="btn btn-secondary text-slate-300 hover:text-white px-3 disabled:opacity-50 disabled:cursor-not-allowed flex-none"
          style={{ padding: "8px 10px", borderRadius: "12px" }}
          title="View files"
        >
          <FaFolderOpen className="w-3.5 h-3.5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openEdit(task)}
          className="btn btn-secondary text-emerald-300 hover:text-emerald-200 px-3 flex-none"
          style={{ padding: "8px 10px", borderRadius: "12px" }}
          title="Edit task"
        >
          <FaPen className="w-3.5 h-3.5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => socket.emit("task:delete", { taskId: task._id, user: actor })}
          className="btn btn-secondary text-rose-300 hover:text-rose-200 px-3 flex-none"
          style={{ padding: "8px 10px", borderRadius: "12px" }}
          title="Delete task"
        >
          <FaTrash className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {task.members && task.members.length > 0 && (
        <div className="flex items-center gap-1 mt-3">
          {task.members.slice(0, 3).map((member) => (
            <div
              key={member._id || member}
              className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-200 flex items-center justify-center text-[10px] font-semibold"
              title={member.username || "Member"}
            >
              {(member.username || "U")[0]?.toUpperCase()}
            </div>
          ))}
          {task.members.length > 3 && (
            <span className="text-[11px] text-slate-400">+{task.members.length - 3}</span>
          )}
        </div>
      )}

      <div className="mt-3">
        <label className="text-[10px] uppercase tracking-widest text-slate-500">Status</label>
        <select
          value={task.column}
          onChange={(e) =>
            socket.emit("task:move", { taskId: task._id, column: e.target.value, user: actor })
          }
          style={{ color: "#f8fafc", backgroundColor: "#0f172a" }}
          className="select-field mt-2 text-xs"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <AttachmentsModal
        taskTitle={task.title}
        attachments={showFiles ? task.attachments || [] : null}
        onClose={() => setShowFiles(false)}
      />
    </motion.div>
  );
}
