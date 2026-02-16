import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import ActivityPanel from "../components/ActivityPanel";

export default function Dashboard() {
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
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Workspace</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">Project Board</h1>
            <p className="text-sm text-slate-400 mt-2">Realtime collaboration across every column.</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
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
            >
              <ActivityPanel />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}