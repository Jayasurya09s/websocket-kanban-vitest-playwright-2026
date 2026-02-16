import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20">
      <div className="glass-panel border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-white">
            Kanban<span className="gradient-text">Flow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary text-xs sm:text-sm">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-primary text-xs sm:text-sm">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
