import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../api/socket";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import UploadModal from "./UploadModal";
import EditTaskModal from "./EditTaskModal";
import BoardMenuModal from "./BoardMenuModal";
import API from "../api/http";
import { useAuth } from "../context/AuthContext";

const columns = [
  { id: "todo", title: "To Do", icon: "📋" },
  { id: "in-progress", title: "In Progress", icon: "⚡" },
  { id: "done", title: "Done", icon: "✅" },
];

export default function KanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", label: "", member: "" });
  const tasksRef = useRef([]);
  const [boardSettings, setBoardSettings] = useState({
    name: "Main Board",
    description: "",
    background: "aurora",
    swimlaneMode: "none",
    powerUps: { calendar: false, analytics: true }
  });

  const actor = user ? { id: user._id, username: user.username, email: user.email } : null;

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    const handleSync = (data) => setTasks(data);
    const handleCreate = (t) => setTasks((p) => [t, ...p]);
    const handleDelete = (id) => setTasks((p) => p.filter((x) => x._id !== id));
    const handleMove = (u) => setTasks((p) => p.map((t) => (t._id === u._id ? u : t)));
    const handleUpdate = (u) => setTasks((p) => p.map((t) => (t._id === u._id ? u : t)));
    const handleAttachment = ({ taskId, attachment }) =>
      setTasks((p) =>
        p.map((t) =>
          t._id === taskId
            ? { ...t, attachments: [...(t.attachments || []), attachment] }
            : t
        )
      );

    socket.emit("sync:tasks");

    socket.on("sync:tasks", handleSync);
    socket.on("task:created", handleCreate);
    socket.on("task:deleted", handleDelete);
    socket.on("task:moved", handleMove);
    socket.on("task:updated", handleUpdate);
    socket.on("attachment:added", handleAttachment);

    return () => {
      socket.off("sync:tasks", handleSync);
      socket.off("task:created", handleCreate);
      socket.off("task:deleted", handleDelete);
      socket.off("task:moved", handleMove);
      socket.off("task:updated", handleUpdate);
      socket.off("attachment:added", handleAttachment);
    };
  }, []);

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    API.get("/board")
      .then((res) => {
        const board = res.data || {};
        setBoardSettings({
          name: board.name || "Main Board",
          description: board.description || "",
          background: board.background || "aurora",
          swimlaneMode: board.swimlaneMode || "none",
          powerUps: board.powerUps || { calendar: false, analytics: true }
        });
      })
      .catch(() => {});
  }, []);

  const labelOptions = useMemo(() => {
    const labels = new Set();
    tasks.forEach((task) => (task.labels || []).forEach((label) => labels.add(label)));
    return Array.from(labels).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !search
        || task.title.toLowerCase().includes(search)
        || (task.description || "").toLowerCase().includes(search);
      const matchesLabel = !filters.label || (task.labels || []).includes(filters.label);
      const matchesMember = !filters.member
        || (task.members || []).some((member) => String(member._id || member) === filters.member);
      return matchesSearch && matchesLabel && matchesMember;
    });
  }, [tasks, filters]);

  const swimlanes = useMemo(() => {
    if (boardSettings.swimlaneMode === "priority") {
      return [
        { id: "low", title: "Low priority" },
        { id: "medium", title: "Medium priority" },
        { id: "high", title: "High priority" }
      ];
    }

    if (boardSettings.swimlaneMode === "member") {
      const memberLanes = users.map((user) => ({
        id: user._id,
        title: user.username
      }));
      return [{ id: "unassigned", title: "Unassigned" }, ...memberLanes];
    }

    return [];
  }, [boardSettings.swimlaneMode, users]);

  const applyBoardSettings = () => {
    API.put("/board/settings", boardSettings)
      .then((res) => {
        const board = res.data || {};
        setBoardSettings({
          name: board.name || "Main Board",
          description: board.description || "",
          background: board.background || "aurora",
          swimlaneMode: board.swimlaneMode || "none",
          powerUps: board.powerUps || { calendar: false, analytics: true }
        });
        setMenuOpen(false);
      })
      .catch(() => setMenuOpen(false));
  };

  const backgroundStyles = {
    aurora: "radial-gradient(circle at top, rgba(20, 184, 166, 0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.2), transparent 50%)",
    midnight: "radial-gradient(circle at top, rgba(59, 130, 246, 0.18), transparent 55%), radial-gradient(circle at 80% 80%, rgba(15, 23, 42, 0.6), transparent 50%)",
    sunset: "radial-gradient(circle at 20% 10%, rgba(249, 115, 22, 0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.2), transparent 50%)",
    ocean: "radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.25), transparent 55%), radial-gradient(circle at 80% 80%, rgba(14, 116, 144, 0.25), transparent 50%)",
    slate: "radial-gradient(circle at 10% 10%, rgba(148, 163, 184, 0.15), transparent 55%), radial-gradient(circle at 80% 80%, rgba(30, 41, 59, 0.5), transparent 55%)"
  };

  const moveCard = (dragId, hoverId, columnId) => {
    setTasks((prev) => {
      const columnTasks = prev
        .filter((task) => task.column === columnId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const dragIndex = columnTasks.findIndex((task) => task._id === dragId);
      const hoverIndex = columnTasks.findIndex((task) => task._id === hoverId);
      if (dragIndex === -1 || hoverIndex === -1 || dragIndex === hoverIndex) return prev;

      const updatedColumn = [...columnTasks];
      const [moved] = updatedColumn.splice(dragIndex, 1);
      updatedColumn.splice(hoverIndex, 0, moved);

      updatedColumn.forEach((task, index) => {
        task.order = index;
      });

      const others = prev.filter((task) => task.column !== columnId);
      return [...others, ...updatedColumn];
    });
  };

  const commitReorder = (columnId) => {
    const orderedIds = tasksRef.current
      .filter((task) => task.column === columnId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((task) => task._id);

    if (orderedIds.length > 0) {
      socket.emit("task:reorder", { column: columnId, orderedIds, user: actor });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            {boardSettings.name}
          </h2>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {boardSettings.description || "Live collaboration enabled"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="glass-panel px-4 py-2 text-xs text-slate-300 font-semibold">
            {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(true)}
            className="btn btn-secondary text-xs"
          >
            Board menu
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="btn btn-primary"
          >
            <span>+</span>
            <span>New Task</span>
          </motion.button>
        </div>
      </motion.div>

      <div
        className="rounded-2xl border border-white/5 p-4"
        style={{ backgroundImage: backgroundStyles[boardSettings.background] || "none" }}
      >
        {boardSettings.swimlaneMode === "none" ? (
          <div className="grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-5 overflow-x-auto pb-6">
            <AnimatePresence mode="wait">
              {columns.map((col, index) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Column
                    col={col}
                    tasks={filteredTasks}
                    openUpload={setUploadTask}
                    openEdit={setEditTask}
                    moveCard={moveCard}
                    commitReorder={commitReorder}
                    actor={actor}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-8">
            {swimlanes.map((lane) => {
              const laneTasks = filteredTasks.filter((task) => {
                if (boardSettings.swimlaneMode === "priority") {
                  return task.priority === lane.id;
                }
                if (boardSettings.swimlaneMode === "member") {
                  if (lane.id === "unassigned") {
                    return !task.members || task.members.length === 0;
                  }
                  return (task.members || []).some((member) => String(member._id || member) === lane.id);
                }
                return true;
              });

              return (
                <div key={lane.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">
                      {lane.title}
                    </h3>
                    <span className="text-xs text-slate-500">{laneTasks.length} tasks</span>
                  </div>
                  <div className="grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-5 overflow-x-auto pb-6">
                    {columns.map((col) => (
                      <Column
                        key={`${lane.id}-${col.id}`}
                        col={col}
                        tasks={laneTasks}
                        openUpload={setUploadTask}
                        openEdit={setEditTask}
                        moveCard={moveCard}
                        commitReorder={commitReorder}
                        actor={actor}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateTaskModal open={open} onClose={() => setOpen(false)} />
      <UploadModal task={uploadTask} close={() => setUploadTask(null)} />
      <EditTaskModal task={editTask} onClose={() => setEditTask(null)} users={users} />
      <BoardMenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        filters={filters}
        setFilters={setFilters}
        labels={labelOptions}
        members={users}
        settings={boardSettings}
        setSettings={setBoardSettings}
        onSave={applyBoardSettings}
      />
    </div>
  );
}

function Column({ col, tasks, openUpload, openEdit, moveCard, commitReorder, actor }) {
  const [isOver, setIsOver] = useState(false);
  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => {
      socket.emit("task:move", { taskId: item.id, column: col.id, user: actor });
    },
    hover: () => setIsOver(true),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (!isOver) return;
    const timeout = setTimeout(() => setIsOver(false), 200);
    return () => clearTimeout(timeout);
  }, [isOver]);

  const columnTasks = tasks
    .filter((t) => t.column === col.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div ref={drop} className="min-w-70">
      <motion.div
        whileHover={{ y: -2 }}
        className={`glass-panel-hover p-5 h-full transition-all duration-300 ${
          isOver ? "border border-emerald-400/40 shadow-lg shadow-emerald-500/10" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="text-xl">{col.icon}</div>
            <div>
              <h3 className="font-semibold text-white text-base">{col.title}</h3>
            </div>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {columnTasks.length}
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-95">
          <AnimatePresence mode="popLayout">
            {columnTasks.map((t, index) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                layout
              >
                <TaskCard
                  task={t}
                  openUpload={openUpload}
                  openEdit={openEdit}
                  moveCard={moveCard}
                  commitReorder={commitReorder}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {columnTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-36 text-slate-500 text-sm"
            >
              <span className="text-2xl mb-2 opacity-30">{col.icon}</span>
              <span>No tasks yet</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}