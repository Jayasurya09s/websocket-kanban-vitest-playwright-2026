import { useState } from "react";
import API from "../api/http";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function UploadModal({ task, close }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!task) return null;

  const upload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("taskId", task._id);
    if (user?.username || user?.email) {
      form.append("user", user.username || user.email);
    }

    setIsUploading(true);
    try {
      const res = await API.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("File uploaded successfully!");
      setFile(null);
      close();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="glass-panel p-8 w-full max-w-md space-y-6"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Attachment</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Upload file</h2>
          <p className="text-sm text-slate-400 mt-1">Task: {task.title}</p>
        </div>

        <div className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-6 text-center">
          <FaCloudUploadAlt className="w-12 h-12 mx-auto text-emerald-300 mb-3" />
          <label className="cursor-pointer">
            <span className="text-emerald-200 font-semibold">Choose file</span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="hidden"
              accept="image/*,.pdf"
            />
          </label>
          <p className="text-xs text-slate-500 mt-2">PNG, JPG, PDF (max 5MB)</p>
          {file && <p className="text-xs text-slate-300 mt-3">{file.name}</p>}
        </div>

        <div className="flex gap-3">
          <button onClick={close} className="flex-1 btn btn-secondary">
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={isUploading || !file}
            className="flex-1 btn btn-primary disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
