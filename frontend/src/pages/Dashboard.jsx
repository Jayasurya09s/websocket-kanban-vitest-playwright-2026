import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import ActivityPanel from "../components/ActivityPanel";

export default function Dashboard() {
  return (
    <div
      className="min-h-screen noise-overlay"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />

      <main className="py-8" style={{ padding: "32px 0" }}>
        <div
          className="w-[96%] max-w-7xl mx-auto px-4 md:px-6"
          style={{ width: "96%", maxWidth: "80rem", margin: "0 auto", padding: "0 24px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
            style={{ marginBottom: "32px" }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em] text-slate-500"
              style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#94a3b8" }}
            >
              Workspace
            </p>
            <h1
              className="text-3xl md:text-4xl font-semibold text-white"
              style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 600, color: "#f8fafc" }}
            >
              Project Board
            </h1>
            <p
              className="text-sm text-slate-400 mt-2"
              style={{ fontSize: "0.95rem", marginTop: "8px", color: "#94a3b8" }}
            >
              Realtime collaboration across every column.
            </p>
          </motion.div>

          <div
            className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]"
            style={{ display: "grid", gap: "24px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <KanbanBoard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-24 self-start"
              style={{ position: "sticky", top: "96px", alignSelf: "flex-start" }}
            >
              <ActivityPanel />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}