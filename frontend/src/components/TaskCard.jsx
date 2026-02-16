import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import socket from "../api/socket";
import { FaTrash, FaPaperclip } from "react-icons/fa";

const PRIORITY_COLOR = {
  low: "bg-cyan-500/20 text-cyan-200",
  medium: "bg-amber-500/20 text-amber-200",
  high: "bg-red-500/20 text-red-200"
};

const CATEGORY_BADGE = {
  bug: "bg-red-500/20 text-red-200",
  feature: "bg-emerald-500/20 text-emerald-200",
  enhancement: "bg-indigo-500/20 text-indigo-200"
};

export default function TaskCard({ task, openUpload }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.03 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-4 rounded-xl glass border border-white/10 glow cursor-grab hover:glow transition"
    >
      <div className="font-semibold text-indigo-100">{task.title}</div>

      <div className="text-xs text-gray-400 mt-2 line-clamp-2">
        {task.description || "No description"}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLOR[task.priority || "medium"] || PRIORITY_COLOR.medium}`}>
          {(task.priority || "medium").charAt(0).toUpperCase()}
        </span>

        <span className={`text-xs px-2 py-1 rounded-full ${CATEGORY_BADGE[task.category || "feature"] || CATEGORY_BADGE.feature}`}>
          {task.category || "feature"}
        </span>

        {task.attachments && task.attachments.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-500/20 text-slate-300 flex items-center gap-1">
            <FaPaperclip className="w-2.5 h-2.5" />
            {task.attachments.length}
          </span>
        )}
      </div>

      <div className="flex justify-between gap-2 mt-4">
        <button
          onClick={() => openUpload(task)}
          className="flex-1 text-xs px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition"
        >
          <FaPaperclip className="inline w-3 h-3 mr-1" /> Add file
        </button>

        <button
          onClick={() => socket.emit("task:delete", task._id)}
          className="px-2 py-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
          title="Delete task"
        >
          <FaTrash className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
