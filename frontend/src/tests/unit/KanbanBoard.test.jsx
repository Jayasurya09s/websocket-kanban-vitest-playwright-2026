import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import KanbanBoard from "../../components/KanbanBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

test("renders board columns", () => {
  renderBoard();
  expect(screen.getByText(/To Do/i)).toBeInTheDocument();
  expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  expect(screen.getByText(/Done/i)).toBeInTheDocument();
});

test("opens create task modal", () => {
  renderBoard();
  fireEvent.click(screen.getByText(/New Task/i));
  expect(screen.getByText(/Create Task/i)).toBeInTheDocument();
});
