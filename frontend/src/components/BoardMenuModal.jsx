import { motion } from "framer-motion";

export default function BoardMenuModal({
  open,
  onClose,
  filters,
  setFilters,
  labels,
  members,
  settings,
  setSettings,
  onSave
}) {
  if (!open) return null;

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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Board menu</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Board settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Board name
            </label>
            <input
              value={settings.name}
              onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="Board name"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => setSettings((prev) => ({ ...prev, description: e.target.value }))}
              className="textarea-field h-20 resize-none"
              placeholder="Describe your board"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Background
            </label>
            <select
              value={settings.background}
              onChange={(e) => setSettings((prev) => ({ ...prev, background: e.target.value }))}
              className="select-field"
            >
              <option value="aurora">Aurora</option>
              <option value="midnight">Midnight</option>
              <option value="sunset">Sunset</option>
              <option value="ocean">Ocean</option>
              <option value="slate">Slate</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Swimlanes
            </label>
            <select
              value={settings.swimlaneMode}
              onChange={(e) => setSettings((prev) => ({ ...prev, swimlaneMode: e.target.value }))}
              className="select-field"
            >
              <option value="none">None</option>
              <option value="priority">By priority</option>
              <option value="member">By member</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Power-ups
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={settings.powerUps.calendar}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      powerUps: { ...prev.powerUps, calendar: !prev.powerUps.calendar }
                    }))
                  }
                />
                Calendar
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={settings.powerUps.analytics}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      powerUps: { ...prev.powerUps, analytics: !prev.powerUps.analytics }
                    }))
                  }
                />
                Analytics
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Search
            </label>
            <input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="input-field"
              placeholder="Search tasks"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Label
            </label>
            <select
              value={filters.label}
              onChange={(e) => setFilters((prev) => ({ ...prev, label: e.target.value }))}
              className="select-field"
            >
              <option value="">All labels</option>
              {labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
              Member
            </label>
            <select
              value={filters.member}
              onChange={(e) => setFilters((prev) => ({ ...prev, member: e.target.value }))}
              className="select-field"
            >
              <option value="">All members</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilters({ search: "", label: "", member: "" })}
            className="flex-1 btn btn-secondary"
          >
            Reset
          </button>
          <button onClick={onSave} className="flex-1 btn btn-primary">
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
