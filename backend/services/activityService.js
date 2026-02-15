const Activity = require("../models/Activity");

class ActivityService {

  async getBoardActivity(boardId) {
    return await Activity.find({ boardId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async getTaskActivity(taskId) {
    return await Activity.find({ taskId })
      .sort({ createdAt: -1 });
  }

}

module.exports = new ActivityService();
