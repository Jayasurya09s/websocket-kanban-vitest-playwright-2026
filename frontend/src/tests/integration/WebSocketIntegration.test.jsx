import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import KanbanBoard from "../../components/KanbanBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import socket from "../../api/socket";

vi.mock("../../api/socket", () => {
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

vi.mock("../../api/http", () => ({
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

test("sync:tasks hydrates board", async () => {
  renderBoard();

  await waitFor(() => expect(socket.on).toHaveBeenCalled());

  socket.__handlers["sync:tasks"]([
    {
      _id: "t1",
      title: "Realtime task",
      column: "todo",
      priority: "medium",
      category: "feature",
    },
  ]);

  expect(await screen.findByText("Realtime task")).toBeInTheDocument();
});

test("task:created appends a new task", async () => {
  renderBoard();

  await waitFor(() => expect(socket.on).toHaveBeenCalled());

  socket.__handlers["task:created"]({
    _id: "t2",
    title: "New socket task",
    column: "todo",
    priority: "high",
    category: "bug",
  });

  expect(await screen.findByText("New socket task")).toBeInTheDocument();
});
