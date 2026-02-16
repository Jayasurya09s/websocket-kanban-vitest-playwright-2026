const Board = require("../models/Board");

class BoardService {
  async getBoard() {
    let board = await Board.findOne();
    if (!board) {
      board = await Board.create({ name: "Main Board" });
    }
    return board;
  }

  async updateBoard(updates) {
    const board = await this.getBoard();
    const allowed = {
      name: updates.name,
      description: updates.description,
      background: updates.background,
      swimlaneMode: updates.swimlaneMode,
      powerUps: updates.powerUps
    };

    Object.keys(allowed).forEach((key) => {
      if (allowed[key] !== undefined) {
        board[key] = allowed[key];
      }
    });

    await board.save();
    return board;
  }
}

module.exports = new BoardService();
