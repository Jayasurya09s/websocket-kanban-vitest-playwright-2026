import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="app-bg text-white overflow-hidden">
      <div className="grid-fade absolute inset-0 opacity-40"></div>

      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="text-2xl font-bold text-indigo-300 tracking-wide">
            KanbanAI
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn-primary glow">
              Get Started
            </Link>
          </div>
        </header>

        <main className="px-6 md:px-12 pb-24">
          <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center mt-10 md:mt-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="badge mb-6"
              >
                AI-ready realtime platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="section-title font-semibold"
              >
                Build velocity with a <span className="gradient-text">neon-powered</span> Kanban that syncs instantly.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 text-lg text-slate-300 max-w-xl"
              >
                KanbanAI combines live collaboration, AI-ready workflow intelligence, and cloud attachments in a premium
                product experience that feels like a modern control room.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link to="/register" className="btn-primary glow">
                  Launch Workspace
                </Link>
                <Link to="/login" className="btn-secondary">
                  I already have access
                </Link>
              </motion.div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Real-time WebSocket sync
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-pink-400"></span>
                  AI-ready analytics
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                  Cloud attachment flow
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass rounded-3xl p-6 md:p-8 glow"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400">Live board</p>
                  <h3 className="text-xl font-semibold">Sprint Velocity</h3>
                </div>
                <span className="badge">Synced</span>
              </div>

              <div className="space-y-4">
                {["Design auth flow", "Refactor socket handler", "Ship analytics v2"].map((item, index) => (
                  <div key={item} className="glass-strong rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item}</p>
                      <span className="mono text-xs text-slate-400">0{index + 1}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>Priority: {index === 0 ? "High" : index === 1 ? "Medium" : "Low"}</span>
                      <span className="badge">{index === 2 ? "Done" : "In Progress"}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <span>Active members</span>
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-indigo-500/40"></span>
                  <span className="h-8 w-8 rounded-full bg-pink-500/40"></span>
                  <span className="h-8 w-8 rounded-full bg-emerald-500/40"></span>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Realtime collaboration",
                detail: "Instant updates across every board with socket-driven sync and optimistic UX."
              },
              {
                title: "AI-ready architecture",
                detail: "Design tasks, summaries, and workflow intelligence with a system built for AI add-ons."
              },
              {
                title: "Enterprise-grade visibility",
                detail: "Track progress, attachments, and activity logs without leaving the board."
              }
            ].map((feature) => (
              <div key={feature.title} className="glass rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-indigo-200">{feature.title}</h4>
                <p className="mt-3 text-sm text-slate-400">{feature.detail}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
