import { render, screen } from "@testing-library/react";
import KanbanBoard from "../../components/KanbanBoard";

test("renders kanban board", () => {
  render(<KanbanBoard />);
  expect(screen.getByText(/To Do/i)).toBeInTheDocument();
});
