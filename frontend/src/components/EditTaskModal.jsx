import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import socket from "../api/socket";

export default function EditTaskModal({ task, onClose, users }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("feature");
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [checkInput, setCheckInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || "");
    setDesc(task.description || "");
    setPriority(task.priority || "medium");
    setCategory(task.category || "feature");
    setLabels(task.labels || []);
    setChecklist(task.checklist || []);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "");
    setMembers((task.members || []).map((member) => member._id || member));
  }, [task]);

  if (!task) return null;

  const save = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      socket.emit("task:update", {
        taskId: task._id,
        updates: {
          title: title.trim(),
          description: desc.trim(),
          priority,
          category,
          labels,
          checklist,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          members,
        },
      });
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

  const addChecklistItem = () => {
    const next = checkInput.trim();
    if (!next) return;
    setChecklist((prev) => [...prev, { text: next, done: false }]);
    setCheckInput("");
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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Edit item</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Update Task</h2>
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

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Checklist
            </label>
            <div className="flex gap-2">
              <input
                value={checkInput}
                onChange={(e) => setCheckInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
                placeholder="Add checklist item"
                className="input-field"
              />
              <button type="button" onClick={addChecklistItem} className="btn btn-secondary text-xs px-3">
                Add
              </button>
            </div>
            <div className="space-y-2 mt-3">
              {checklist.map((item, index) => (
                <div key={`${item.text}-${index}`} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() =>
                      setChecklist((prev) =>
                        prev.map((entry, idx) =>
                          idx === index ? { ...entry, done: !entry.done } : entry
                        )
                      )
                    }
                  />
                  <span className="text-sm text-slate-200 flex-1">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => setChecklist((prev) => prev.filter((_, idx) => idx !== index))}
                    className="text-xs text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Members
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {(users || []).length === 0 ? (
                <p className="text-xs text-slate-400">No users available.</p>
              ) : (
                users.map((user) => (
                  <label key={user._id} className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={members.includes(user._id)}
                      onChange={() => {
                        setMembers((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        );
                      }}
                    />
                    {user.username}
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Attachments
            </label>
            <div className="space-y-2">
              {(task.attachments || []).length === 0 ? (
                <p className="text-xs text-slate-400">No files uploaded yet.</p>
              ) : (
                task.attachments.map((file) => (
                  <a
                    key={file._id || file.fileUrl}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-panel-hover p-3 block text-sm text-slate-200"
                  >
                    {file.fileName || "Untitled"}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn btn-secondary">
            Cancel
          </button>

          <button
            onClick={save}
            disabled={isSubmitting || !title.trim()}
            className="flex-1 btn btn-primary disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
