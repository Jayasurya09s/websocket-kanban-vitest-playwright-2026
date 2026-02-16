import { io } from "socket.io-client";

const socket = io("https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com", {
  transports: ["websocket"]
});

export default socket;
