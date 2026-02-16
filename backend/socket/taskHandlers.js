const taskService = require("../services/taskService");

module.exports = function registerTaskHandlers(io, socket) {

  const getActor = (user) => {
    if (!user) return "anonymous";
    if (typeof user === "string") return user;
    return user.username || user.email || user.id || "anonymous";
  };

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
      const payload = data || {};
      const actor = getActor(payload.user);
      const { user, ...taskData } = payload;

      const task = await taskService.createTask(taskData, actor);

      io.emit("task:created", task); // broadcast to all
      callback?.({ status: "ok", task });

    } catch (err) {
      console.error("Create error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= UPDATE TASK =================
  socket.on("task:update", async (data, callback) => {
    try {
      const taskId = data?.taskId;
      const updates = data?.updates || {};
      const actor = getActor(data?.user);

      const updated = await taskService.updateTask(taskId, updates, actor);

      io.emit("task:updated", updated);
      callback?.({ status: "ok", task: updated });

    } catch (err) {
      console.error("Update error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= MOVE TASK =================
  socket.on("task:move", async (data, callback) => {
    try {
      const taskId = data?.taskId;
      const column = data?.column;
      const actor = getActor(data?.user);

      const moved = await taskService.moveTask(taskId, column, actor);

      io.emit("task:moved", moved);
      callback?.({ status: "ok", task: moved });

    } catch (err) {
      console.error("Move error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= REORDER TASKS =================
  socket.on("task:reorder", async (data, callback) => {
    try {
      const column = data?.column;
      const orderedIds = data?.orderedIds || [];
      const actor = getActor(data?.user);

      const tasks = await taskService.reorderTasks(column, orderedIds, actor);

      io.emit("sync:tasks", tasks);
      callback?.({ status: "ok" });

    } catch (err) {
      console.error("Reorder error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= DELETE TASK =================
  socket.on("task:delete", async (data, callback) => {
    try {
      const taskId = typeof data === "string" ? data : data?.taskId;
      const actor = getActor(typeof data === "string" ? null : data?.user);

      await taskService.deleteTask(taskId, actor);

      io.emit("task:deleted", taskId);
      callback?.({ status: "ok" });

    } catch (err) {
      console.error("Delete error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

  // ================= ADD ATTACHMENT =================
  socket.on("attachment:add", async (data, callback) => {
    try {
      const taskId = data?.taskId;
      const file = data?.file;
      const actor = getActor(data?.user);

      const attachment = await taskService.addAttachment(taskId, file, actor);

      io.emit("attachment:added", { taskId, attachment });
      callback?.({ status: "ok", attachment });

    } catch (err) {
      console.error("Attachment error:", err.message);
      callback?.({ status: "error", message: err.message });
    }
  });

};
