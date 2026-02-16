import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient cursor follower */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-8"
      >
        <div className="w-[96%] max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl md:text-3xl font-bold"
          >
            <span className="text-gradient">Kanban</span>
            <span className="text-white">Flow</span>
          </motion.div>

          <div className="flex items-center gap-3 md:gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="btn btn-secondary text-sm md:text-base">
                Sign In
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn btn-primary text-sm md:text-base">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12 md:py-20">
        <div className="w-[96%] max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-gray-300">Realtime Collaboration</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              Organize Your Work
              <br />
              <span className="text-gradient">The Modern Way</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Streamline your workflow with beautiful kanban boards, real-time updates, 
              and powerful analytics. Built for teams that move fast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link to="/register" className="btn btn-primary text-lg px-10 py-4 w-full sm:w-auto shadow-glow">
                  Start Free Trial
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link to="/login" className="btn btn-secondary text-lg px-10 py-4 w-full sm:w-auto">
                  View Dashboard
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 pt-12 md:pt-16 max-w-4xl mx-auto"
            >
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "<100ms", label: "Response Time" },
                { value: "10K+", label: "Active Users" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                  className="glass-card stat-card p-5 md:p-6"
                >
                  <div className="text-2xl md:text-4xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-2">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 md:mt-28"
          >
            {[
              {
                icon: "🚀",
                title: "Lightning Fast",
                description: "Real-time updates powered by WebSocket technology. See changes instantly across all devices.",
              },
              {
                icon: "🎨",
                title: "Beautiful Design",
                description: "Intuitive interface with smooth animations and modern glassmorphism effects.",
              },
              {
                icon: "📊",
                title: "Smart Analytics",
                description: "Get insights into your productivity with comprehensive charts and statistics.",
              },
              {
                icon: "☁️",
                title: "Cloud Storage",
                description: "Upload and attach files directly to tasks with Cloudinary integration.",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description: "Your data is protected with JWT authentication and encrypted connections.",
              },
              {
                icon: "📱",
                title: "Fully Responsive",
                description: "Works seamlessly on desktop, tablet, and mobile devices.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card feature-card p-6 md:p-8 group"
              >
                <div className="text-4xl md:text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-24 md:mt-32 text-center"
          >
            <div className="glass-card p-12 md:p-16 max-w-4xl mx-auto border-gradient feature-card">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Ready to boost your productivity?
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join thousands of teams already using KanbanFlow to organize their work and achieve more.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn btn-primary text-lg px-12 py-5 shadow-glow">
                  Get Started for Free
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-24 pb-12 text-center text-gray-500 text-sm"
          >
            <p>© 2024 KanbanFlow. Built with React, Socket.IO, and passion.</p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}
