import { useState } from "react";
import API from "../api/http";
import { useNavigate, Link } from "react-router-dom";

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

  return (
    <div className="app-bg flex items-center justify-center px-6 py-16">
      <div className="grid w-full max-w-4xl gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="hidden lg:block">
          <p className="badge">Launch access</p>
          <h2 className="section-title mt-6">Create your KanbanAI workspace in minutes.</h2>
          <p className="mt-4 text-slate-400">
            Unlock realtime workflows, analytics, and cloud attachments with a secure account setup.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
          <h2 className="text-3xl mb-2 text-indigo-200 font-semibold">Register</h2>
          <p className="text-sm text-slate-400 mb-6">Sign up and start collaborating instantly.</p>

          <div className="space-y-4">
            <input
              placeholder="Username"
              className="input-field"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              className="input-field"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={submit}
            disabled={isLoading}
            className="btn-primary glow w-full mt-6 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm mt-6 text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
