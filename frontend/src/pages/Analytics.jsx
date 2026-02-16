import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import socket from "../api/socket";

const COLORS = ["#6366f1", "#ec4899", "#22c55e"];

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleSync = (tasks) => {
      const todo = tasks.filter((t) => t.column === "todo").length;
      const prog = tasks.filter((t) => t.column === "in-progress").length;
      const done = tasks.filter((t) => t.column === "done").length;

      setData([
        { name: "Todo", value: todo },
        { name: "Progress", value: prog },
        { name: "Done", value: done }
      ]);
    };

    socket.emit("sync:tasks");
    socket.on("sync:tasks", handleSync);

    return () => {
      socket.off("sync:tasks", handleSync);
    };
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="app-bg flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <Navbar />

        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-indigo-200 font-semibold">Analytics</h2>
              <p className="text-sm text-slate-400">Realtime distribution of tasks across the board.</p>
            </div>
            <div className="glass-strong rounded-2xl px-4 py-3 text-sm">
              <p className="text-slate-400">Total tasks</p>
              <p className="text-lg text-indigo-200 font-semibold">{total}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass p-8 rounded-3xl h-[420px]">
              {total === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No tasks yet. Create one to see analytics.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} dataKey="value" outerRadius={150} innerRadius={70} paddingAngle={4}>
                      {data.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg text-indigo-200 font-semibold mb-4">Status breakdown</h3>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                      <span className="text-sm text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm text-slate-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
