const taskService = require("../services/taskService");

module.exports = function registerTaskHandlers(io, socket) {

  console.log("⚡ Registering task handlers for:", socket.id);

  // ================= SYNC ALL TASKS =================
  socket.on("sync:tasks", async (callback) => {
    try {
      const tasks = await taskService.getAllTasks();

      socket.emit("sync:tasks", tasks);

      callback?.({ status: "ok" });
    } catch (err) {
      console.error(err);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= CREATE TASK =================
  socket.on("task:create", async (data, callback) => {
    try {
      const task = await taskService.createTask(data, socket.id);

      io.emit("task:created", task); // broadcast to all
      callback?.({ status: "ok", task });

    } catch (err) {
      console.error("Create error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= UPDATE TASK =================
  socket.on("task:update", async ({ taskId, updates }, callback) => {
    try {
      const updated = await taskService.updateTask(
        taskId,
        updates,
        socket.id
      );

      io.emit("task:updated", updated);
      callback?.({ status: "ok", task: updated });

    } catch (err) {
      console.error("Update error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= MOVE TASK =================
  socket.on("task:move", async ({ taskId, column }, callback) => {
    try {
      const moved = await taskService.moveTask(
        taskId,
        column,
        socket.id
      );

      io.emit("task:moved", moved);
      callback?.({ status: "ok", task: moved });

    } catch (err) {
      console.error("Move error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= DELETE TASK =================
  socket.on("task:delete", async (taskId, callback) => {
    try {
      await taskService.deleteTask(taskId, socket.id);

      io.emit("task:deleted", taskId);
      callback?.({ status: "ok" });

    } catch (err) {
      console.error("Delete error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= ADD ATTACHMENT =================
  socket.on("attachment:add", async ({ taskId, file }, callback) => {
    try {
      const attachment = await taskService.addAttachment(
        taskId,
        file,
        socket.id
      );

      io.emit("attachment:added", { taskId, attachment });
      callback?.({ status: "ok", attachment });

    } catch (err) {
      console.error("Attachment error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

};
