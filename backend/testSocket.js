const { io } = require("socket.io-client");

console.log("Starting socket test...");

const socket = io("https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com", {

  transports: ["websocket"],
  timeout: 5000
});

socket.on("connect", () => {
  console.log(" Connected to server:", socket.id);

  socket.emit(
    "task:create",
    {
      title: "Realtime test task",
      description: "socket working test",
      priority: "high",
      category: "bug"
    },
    (res) => {
      console.log("Create response:", res);
    }
  );
});

socket.on("connect_error", (err) => {
  console.log(" Connection error:", err.message);
});

socket.on("task:created", (task) => {
  console.log(" Realtime received:", task.title);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
