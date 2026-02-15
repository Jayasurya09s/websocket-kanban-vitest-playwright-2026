import { describe, it, expect } from "vitest";
import taskService from "../services/taskService.js";

describe("Task Service Basic Tests", () => {

  it("should throw error if title missing", async () => {
    await expect(
      taskService.createTask({
        title: "",
        priority: "high",
        category: "bug"
      })
    ).rejects.toThrow("Task title is required");
  });

  it("should throw error for invalid priority", async () => {
    await expect(
      taskService.createTask({
        title: "Test",
        priority: "super-high",
        category: "bug"
      })
    ).rejects.toThrow("Invalid priority value");
  });

});
