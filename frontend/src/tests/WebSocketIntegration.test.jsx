import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import KanbanBoard from "../components/KanbanBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import socket from "../api/socket";

vi.mock("../api/socket", () => {
  const handlers = {};
  return {
    default: {
      connected: true,
      emit: vi.fn(),
      on: vi.fn((event, cb) => {
        handlers[event] = cb;
      }),
      off: vi.fn((event) => {
        delete handlers[event];
      }),
      __handlers: handlers,
    },
  };
});

vi.mock("../api/http", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
  },
}));

const renderBoard = () =>
  render(
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <KanbanBoard />
      </DndProvider>
    </AuthProvider>
  );

test("task:deleted removes card", async () => {
  renderBoard();

  await waitFor(() => expect(socket.on).toHaveBeenCalled());

  socket.__handlers["sync:tasks"]([
    {
      _id: "t3",
      title: "Task to delete",
      column: "todo",
      priority: "low",
      category: "feature",
    },
  ]);

  expect(await screen.findByText("Task to delete")).toBeInTheDocument();

  socket.__handlers["task:deleted"]("t3");
  await waitFor(() => expect(screen.queryByText("Task to delete")).toBeNull());
});
