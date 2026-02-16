import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import LiveUsersBadge from "../components/LiveUsersBadge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";
import socket from "../api/socket";
import API from "../api/http";

const COLORS = ["#2dd4bf", "#f59e0b", "#fb7185"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface-muted rounded-xl p-3 border border-white/20 shadow-xl"
      >
        <p className="text-sm font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-lg text-teal-300 font-bold">{payload[0].value} tasks</p>
      </motion.div>
    );
  }
  return null;
};

export default function Analytics() {
  const [data, setData] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [activity, setActivity] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    const handleSync = (tasks) => {
      setBoardId(tasks?.[0]?.boardId || null);
      const todo = tasks.filter((t) => t.column === "todo").length;
      const prog = tasks.filter((t) => t.column === "in-progress").length;
      const done = tasks.filter((t) => t.column === "done").length;

      setData([
        { name: "To Do", value: todo },
        { name: "In Progress", value: prog },
        { name: "Done", value: done },
      ]);
    };

    socket.emit("sync:tasks");
    socket.on("sync:tasks", handleSync);

    const handleOnline = (payload) => {
      if (!payload || typeof payload === "number") return;
      const users = Array.isArray(payload.users) ? payload.users : [];
      const next = new Map();
      users.forEach((user) => {
        if (user?.socketId) {
          next.set(user.socketId, user.username || user.email || "Guest");
        }
      });
      setOnlineUsers(next);
    };

    socket.on("users:online", handleOnline);

    return () => {
      socket.off("sync:tasks", handleSync);
      socket.off("users:online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (!boardId) return;
    API.get(`/activity/board/${boardId}`)
      .then((res) => setActivity(res.data || []))
      .catch(() => setActivity([]));
  }, [boardId]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentage = (value) => (total > 0 ? Math.round((value / total) * 100) : 0);
  const todo = data.find((item) => item.name === "To Do")?.value || 0;
  const inProgress = data.find((item) => item.name === "In Progress")?.value || 0;
  const done = data.find((item) => item.name === "Done")?.value || 0;

  const kpis = [
    { label: "Total tasks", value: total },
    { label: "In progress", value: inProgress },
    { label: "Completed", value: done },
    { label: "Completion rate", value: `${percentage(done)}%` },
  ];

  const statusRows = data.map((item, index) => ({
    ...item,
    color: COLORS[index],
    percent: percentage(item.value)
  }));

  const activityByDay = (() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - idx));
      const label = date.toLocaleDateString([], { month: "short", day: "numeric" });
      return { key: date.toDateString(), label, created: 0, moved: 0, updated: 0 };
    });

    const indexMap = new Map(days.map((d) => [d.key, d]));

    activity.forEach((log) => {
      const dateKey = new Date(log.createdAt).toDateString();
      const bucket = indexMap.get(dateKey);
      if (!bucket) return;
      if (log.action === "TASK_CREATED") bucket.created += 1;
      if (log.action === "TASK_MOVED") bucket.moved += 1;
      if (log.action === "TASK_UPDATED") bucket.updated += 1;
    });

    return days;
  })();

  const activityByType = [
    { name: "Created", value: activity.filter((log) => log.action === "TASK_CREATED").length },
    { name: "Moved", value: activity.filter((log) => log.action === "TASK_MOVED").length },
    { name: "Updated", value: activity.filter((log) => log.action === "TASK_UPDATED").length },
    { name: "Deleted", value: activity.filter((log) => log.action === "TASK_DELETED").length },
    { name: "Attachments", value: activity.filter((log) => log.action === "ATTACHMENT_ADDED").length }
  ];

  const getActorName = (log) => {
    const performer = log?.performedBy;
    if (typeof performer === "string") {
      if (performer.includes("@")) return performer;
      return onlineUsers.get(performer) || "Guest";
    }
    return performer?.username || performer?.email || "Guest";
  };

  const recentActivity = [...activity]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const topContributors = (() => {
    const counts = new Map();
    activity.forEach((log) => {
      const name = getActorName(log);
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  })();


  return (
    <div className="min-h-screen noise-overlay">
      <Navbar />

      <main className="py-8">
        <div className="w-[96%] max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Insights</p>
                <h1 className="text-3xl md:text-4xl font-semibold text-white">Analytics</h1>
                <p className="text-sm text-slate-400 mt-2">Realtime distribution of tasks across the board.</p>
              </div>
              <LiveUsersBadge />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi, index) => (
              <div
                key={kpi.label}
                className="glass-panel-hover p-5 stagger-item"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">{kpi.label}</p>
                <p className="text-2xl font-semibold text-white">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="surface p-6 md:p-8 h-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
              <div className="relative z-10 h-full">
                {total === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="text-5xl opacity-30">📊</div>
                    <p>No tasks yet. Create one to see analytics.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={150}
                        innerRadius={85}
                        paddingAngle={5}
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index]}
                            style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))" }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Status breakdown</h3>
              <div className="space-y-5">
                {statusRows.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-slate-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 font-semibold">{item.value}</span>
                        <span className="text-xs text-slate-500">{item.percent}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-[1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Momentum</h3>
              <p className="text-xs text-slate-500 mb-6">Estimated throughput based on current board.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Work in progress</span>
                  <span className="text-sm text-slate-200 font-semibold">{inProgress}</span>
                </div>
                <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percentage(inProgress)}%`, backgroundColor: COLORS[1] }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Completion rate</span>
                  <span className="text-sm text-slate-200 font-semibold">{percentage(done)}%</span>
                </div>
                <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percentage(done)}%`, backgroundColor: COLORS[2] }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Queue health</h3>
              <p className="text-xs text-slate-500 mb-6">Distribution across the workflow.</p>
              <div className="grid grid-cols-3 gap-4">
                {statusRows.map((item) => (
                  <div key={item.name} className="glass-panel-hover p-4 text-center">
                    <div
                      className="h-2 w-2 rounded-full mx-auto mb-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-xs text-slate-400">{item.name}</p>
                    <p className="text-lg text-white font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-[1.5fr_0.5fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Activity trend</h3>
              <p className="text-xs text-slate-500 mb-6">Last 7 days of board activity.</p>
              <div className="h-65">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityByDay} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="created" stroke="#2dd4bf" strokeWidth={2} />
                    <Line type="monotone" dataKey="moved" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="updated" stroke="#fb7185" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Activity mix</h3>
              <p className="text-xs text-slate-500 mb-6">Board actions by type.</p>
              <div className="space-y-3">
                {activityByType.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="text-sm text-slate-200 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.52 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent activity</h3>
              <p className="text-xs text-slate-500 mb-6">Latest updates and who made them.</p>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="text-sm text-slate-400">No activity yet.</div>
                ) : (
                  recentActivity.map((log) => (
                    <div key={log._id} className="glass-panel-hover p-4">
                      <div className="text-sm text-white font-semibold truncate">
                        {log.metadata?.title || "Untitled task"}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {log.action.replace(/_/g, " ")}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        by {getActorName(log)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Top contributors</h3>
              <p className="text-xs text-slate-500 mb-6">Most active members this week.</p>
              <div className="space-y-3">
                {topContributors.length === 0 ? (
                  <div className="text-sm text-slate-400">No contributors yet.</div>
                ) : (
                  topContributors.map((person) => (
                    <div key={person.name} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300 truncate">{person.name}</span>
                      <span className="text-sm text-slate-200 font-semibold">{person.count}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-[1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Status bars</h3>
              <p className="text-xs text-slate-500 mb-6">Task count by column.</p>
              <div className="h-65">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusRows} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="surface p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Action volume</h3>
              <p className="text-xs text-slate-500 mb-6">Activity totals by type.</p>
              <div className="h-65">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityByType} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}