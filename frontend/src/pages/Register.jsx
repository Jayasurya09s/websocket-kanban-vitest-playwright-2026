import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/http";
import { useNavigate, Link } from "react-router-dom";
import LiveUsersBadge from "../components/LiveUsersBadge";

export default function Register() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    try {
      setIsLoading(true);
      await API.post("/auth/register", { username, email, password });
      alert("Registered! Please login");
      nav("/login");
    } catch {
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 noise-overlay">
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-block">
            <motion.div whileHover={{ scale: 1.03 }} className="text-2xl font-semibold text-white">
              Kanban<span className="gradient-text">Flow</span>
            </motion.div>
          </Link>
          <LiveUsersBadge />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 md:p-10"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2">Create account</h2>
            <p className="text-sm text-slate-400">Set up your workspace in minutes.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
                Username
              </label>
              <input
                placeholder="johndoe"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
                Email
              </label>
              <input
                placeholder="you@example.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 mb-2 block">
                Password
              </label>
              <input
                placeholder="••••••••"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submit}
            disabled={isLoading}
            className="btn btn-primary w-full mt-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.span>
            ) : (
              "Create Account"
            )}
          </motion.button>

          <p className="text-sm mt-6 text-slate-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-300 hover:text-emerald-200 transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}