import { useState } from "react";
import API from "../api/http";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    try {
      setIsLoading(true);
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      nav("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-bg flex items-center justify-center px-6 py-16">
      <div className="grid w-full max-w-4xl gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="hidden lg:block">
          <p className="badge">Secure access</p>
          <h2 className="section-title mt-6">Welcome back to your realtime workspace.</h2>
          <p className="mt-4 text-slate-400">
            Sign in to continue shaping product flow, analytics, and collaborative velocity. Everything stays in sync.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
          <h2 className="text-3xl mb-2 text-indigo-200 font-semibold">Login</h2>
          <p className="text-sm text-slate-400 mb-6">Use your workspace credentials to continue.</p>

          <div className="space-y-4">
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
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <p className="text-sm mt-6 text-slate-400">
            No account?{" "}
            <Link to="/register" className="text-indigo-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
