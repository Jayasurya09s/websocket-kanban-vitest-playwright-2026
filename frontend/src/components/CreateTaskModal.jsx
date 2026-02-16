import { useState } from "react";
import socket from "../api/socket";
import { motion } from "framer-motion";

export default function CreateTaskModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("feature");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const create = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      socket.emit("task:create", {
        title: title.trim(),
        description: desc.trim(),
        priority,
        category
      });

      setTitle("");
      setDesc("");
      setPriority("medium");
      setCategory("feature");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-md space-y-6"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">New item</p>
          <h2 className="text-2xl font-semibold text-indigo-200 mt-2">Create Task</h2>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            autoFocus
          />

          <textarea
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="textarea-field h-24 resize-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="select-field"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-field"
            >
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="enhancement">Enhancement</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>

          <button
            onClick={create}
            disabled={isSubmitting || !title.trim()}
            className="flex-1 btn-primary glow disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
