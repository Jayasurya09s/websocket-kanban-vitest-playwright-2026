import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { useAuth } from "./context/AuthContext";

function Private({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>

      {/* public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* app */}
      <Route path="/dashboard" element={<Private><Dashboard/></Private>} />
      <Route path="/analytics" element={<Private><Analytics/></Private>} />

    </Routes>
  );
}
