import { useState } from "react";
import socket from "../api/socket";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function CreateTaskModal({ open, onClose }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("feature");
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const create = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const actor = user
        ? { id: user._id, username: user.username, email: user.email }
        : null;

      socket.emit("task:create", {
        title: title.trim(),
        description: desc.trim(),
        priority,
        category,
        labels,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        user: actor
      });

      setTitle("");
      setDesc("");
      setPriority("medium");
      setCategory("feature");
      setLabels([]);
      setLabelInput("");
      setDueDate("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLabel = () => {
    const next = labelInput.trim();
    if (!next || labels.includes(next)) return;
    setLabels((prev) => [...prev, next]);
    setLabelInput("");
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
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="glass-panel p-8 w-full max-w-md space-y-6"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">New item</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Create Task</h2>
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

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Labels
            </label>
            <div className="flex gap-2">
              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLabel();
                  }
                }}
                placeholder="Add label"
                className="input-field"
              />
              <button type="button" onClick={addLabel} className="btn btn-secondary text-xs px-3">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {labels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setLabels((prev) => prev.filter((item) => item !== label))}
                  className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-slate-200 bg-white/5"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn btn-secondary">
            Cancel
          </button>

          <button
            onClick={create}
            disabled={isSubmitting || !title.trim()}
            className="flex-1 btn btn-primary disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
