import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KanbanBoard from "../components/KanbanBoard";
import ActivityPanel from "../components/ActivityPanel";

export default function Dashboard() {
  return (
    <div className="app-bg flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">
        <Navbar />

        <div className="flex flex-1 p-6 gap-6 overflow-hidden">
          <div className="flex-1 min-w-0">
            <KanbanBoard />
          </div>

          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}
