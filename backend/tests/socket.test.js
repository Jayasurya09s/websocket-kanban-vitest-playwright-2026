import { describe, it, expect } from "vitest";
import { io } from "socket.io-client";

const URL = "http://localhost:5000";

describe("Socket realtime tests", () => {

  it("should connect to socket server", async () => {
    const socket = io(URL);

    await new Promise((resolve) => {
      socket.on("connect", () => {
        expect(socket.connected).toBe(true);
        socket.disconnect();
        resolve();
      });
    });
  });

  it("should create task via socket", async () => {
    const socket = io(URL);

    await new Promise((resolve, reject) => {
      socket.on("connect", () => {

        socket.emit(
          "task:create",
          {
            title: "Vitest socket task",
            priority: "high",
            category: "bug"
          },
          (res) => {
            try {
              expect(res.status).toBe("ok");
              expect(res.task.title).toBe("Vitest socket task");
              socket.disconnect();
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    });
  });

  it("should broadcast task to multiple clients", async () => {
  const socket1 = io(URL);
  const socket2 = io(URL);

  await new Promise((resolve, reject) => {
    socket2.on("task:created", (task) => {
      try {
        expect(task.title).toBe("Multi client task");
        socket1.disconnect();
        socket2.disconnect();
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    socket1.on("connect", () => {
      socket1.emit("task:create", {
        title: "Multi client task",
        priority: "medium",
        category: "feature"
      });
    });
  });
});


});
