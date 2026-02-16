import { render } from "@testing-library/react";
import KanbanBoard from "../components/KanbanBoard";

test("kanban loads", () => {
  render(<KanbanBoard />);
});
