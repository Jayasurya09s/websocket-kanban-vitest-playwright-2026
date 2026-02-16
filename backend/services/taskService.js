const Task = require("../models/Task");
const Board = require("../models/Board");
const Attachment = require("../models/Attachment");
const Activity = require("../models/Activity");

// ================= VALIDATION =================

const validPriorities = ["low", "medium", "high"];
const validCategories = ["bug", "feature", "enhancement"];
const validColumns = ["todo", "in-progress", "done"];

function validateTaskInput(data) {
  if (!data.title || data.title.trim() === "") {
    throw new Error("Task title is required");
  }

  if (data.priority && !validPriorities.includes(data.priority)) {
    throw new Error("Invalid priority value");
  }

  if (data.category && !validCategories.includes(data.category)) {
    throw new Error("Invalid category value");
  }

  if (data.column && !validColumns.includes(data.column)) {
    throw new Error("Invalid column value");
  }
}

// ================= SERVICE =================

class TaskService {
  
  //  Create Task
  async createTask(data, user = "anonymous") {
    validateTaskInput(data);

    let board = await Board.findOne();
    if (!board) {
      board = await Board.create({ name: "Main Board" });
    }

    const lastTask = await Task.findOne({
      isDeleted: false,
      column: data.column || "todo"
    }).sort({ order: -1 });
    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title: data.title,
      description: data.description || "",
      priority: data.priority || "medium",
      category: data.category || "feature",
      column: data.column || "todo",
      boardId: board._id,
      labels: data.labels || [],
      checklist: data.checklist || [],
      dueDate: data.dueDate || null,
      members: data.members || [],
      order: typeof data.order === "number" ? data.order : nextOrder,
      createdBy: user,
      updatedBy: user
    });

    await Activity.create({
      action: "TASK_CREATED",
      taskId: task._id,
      boardId: board._id,
      performedBy: user,
      metadata: { title: task.title }
    });

    return task;
  }

  // 🔹 Get All Tasks
  async getAllTasks() {
    return await Task.find({ isDeleted: false })
      .populate("attachments")
      .populate("members", "username email")
      .sort({ order: 1, createdAt: 1 });
  }

  // 🔹 Update Task
  async updateTask(taskId, updates, user = "anonymous") {
    validateTaskInput({ ...updates, title: updates.title || "ok" });

    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    Object.assign(task, updates);
    task.updatedBy = user;

    await task.save();

    await Activity.create({
      action: "TASK_UPDATED",
      taskId: task._id,
      boardId: task.boardId,
      performedBy: user,
      metadata: updates
    });

    return task;
  }

  // 🔹 Move Task
  async moveTask(taskId, newColumn, user = "anonymous") {
    if (!validColumns.includes(newColumn)) {
      throw new Error("Invalid column");
    }

    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    const lastTask = await Task.findOne({
      isDeleted: false,
      column: newColumn
    }).sort({ order: -1 });
    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    const oldColumn = task.column;
    task.column = newColumn;
    task.order = nextOrder;
    task.updatedBy = user;

    await task.save();

    await Activity.create({
      action: "TASK_MOVED",
      taskId: task._id,
      boardId: task.boardId,
      performedBy: user,
      metadata: { from: oldColumn, to: newColumn }
    });

    return task;
  }

  // 🔹 Reorder Tasks in Column
  async reorderTasks(column, orderedIds, user = "anonymous") {
    if (!validColumns.includes(column)) {
      throw new Error("Invalid column");
    }

    const tasks = await Task.find({
      _id: { $in: orderedIds },
      column,
      isDeleted: false
    });

    const tasksById = new Map(tasks.map((task) => [String(task._id), task]));

    await Promise.all(
      orderedIds.map((id, index) => {
        const task = tasksById.get(String(id));
        if (!task) return null;
        task.order = index;
        task.updatedBy = user;
        return task.save();
      })
    );

    return await Task.find({ isDeleted: false })
      .populate("attachments")
      .populate("members", "username email")
      .sort({ order: 1, createdAt: 1 });
  }

  // 🔹 Delete Task (soft delete)
  async deleteTask(taskId, user = "anonymous") {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    task.isDeleted = true;
    await task.save();

    await Activity.create({
      action: "TASK_DELETED",
      taskId: task._id,
      boardId: task.boardId,
      performedBy: user
    });

    return { success: true };
  }

  // 🔹 Add Attachment
  async addAttachment(taskId, fileData, user = "anonymous") {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    const attachment = await Attachment.create({
      fileName: fileData.name,
      fileUrl: fileData.url,
      fileType: fileData.type,
      fileSize: fileData.size,
      uploadedBy: user
    });

    task.attachments.push(attachment._id);
    await task.save();

    await Activity.create({
      action: "ATTACHMENT_ADDED",
      taskId: task._id,
      boardId: task.boardId,
      performedBy: user,
      metadata: { file: fileData.name }
    });

    return attachment;
  }
}

module.exports = new TaskService();
