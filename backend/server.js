const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const registerTaskHandlers = require("./socket/taskHandlers");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folder for uploads
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // register all task events
  registerTaskHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);
