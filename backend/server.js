const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const registerTaskHandlers = require("./socket/taskHandlers");
const uploadRoute = require("./routes/upload");
const activityRoute = require("./routes/activity");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const boardRoute = require("./routes/board");

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// ================= DB =================
connectDB();

// ================= SECURITY & LOGGING =================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100
});
app.use(limiter);

// ================= BODY =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoute);
app.use("/api/activity", activityRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/board", boardRoute);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

const emitOnlineUsers = () => {
  const users = Array.from(onlineUsers.values());
  io.emit("users:online", { count: users.length, users });
};

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  onlineUsers.set(socket.id, {
    socketId: socket.id,
    username: "Guest"
  });
  emitOnlineUsers();

  registerTaskHandlers(io, socket);

  socket.on("users:identify", (user) => {
    const username = user?.username || user?.email || "Guest";
    onlineUsers.set(socket.id, {
      socketId: socket.id,
      userId: user?.id || user?._id || null,
      username,
      email: user?.email || null
    });
    emitOnlineUsers();
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);

    onlineUsers.delete(socket.id);
    emitOnlineUsers();
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
