import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { useAuth } from "./context/AuthContext";
import socket from "./api/socket";

function Private({ children }) {
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("token");
  return storedToken ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const identify = () => socket.emit("users:identify", payload);
    identify();
    socket.on("connect", identify);

    return () => {
      socket.off("connect", identify);
    };
  }, [user]);

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
