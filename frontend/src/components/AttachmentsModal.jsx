import { motion } from "framer-motion";

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function AttachmentsModal({ taskTitle, attachments, onClose }) {
  if (!attachments) return null;

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
        className="glass-panel p-8 w-full max-w-lg space-y-6"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Attachments</p>
          <h2 className="text-2xl font-semibold text-white mt-2">{taskTitle}</h2>
        </div>

        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
          {attachments.length === 0 ? (
            <p className="text-sm text-slate-400">No files uploaded yet.</p>
          ) : (
            attachments.map((file) => (
              <div
                key={file._id || file.fileUrl}
                className="glass-panel-hover p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white font-semibold truncate">
                    {file.fileName || "Untitled"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {file.fileType || "file"}
                    {file.fileSize ? ` · ${formatSize(file.fileSize)}` : ""}
                  </p>
                </div>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn btn-secondary text-xs px-3 py-2"
                >
                  Download
                </a>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="btn btn-secondary text-sm px-4 py-2">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
