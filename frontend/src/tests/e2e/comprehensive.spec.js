import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_BASE_URL =
  process.env.PLAYWRIGHT_API_BASE_URL ||
  "https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com/api";

const createUser = async (request) => {
  const suffix = Date.now();
  const email = `e2e-upload-${suffix}@kanban.test`;
  const password = "Test1234!";
  const username = `e2e_upload_${suffix}`;

  await request.post(`${API_BASE_URL}/auth/register`, {
    data: { username, email, password },
  });

  const login = await request.post(`${API_BASE_URL}/auth/login`, {
    data: { email, password },
  });

  const payload = await login.json();
  return { payload, email, password, username };
};

const loginWithStorage = async (page, payload) => {
  await page.addInitScript(({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }, payload);
};

test.describe("KanbanFlow upload + analytics", () => {
  test("user can upload an attachment", async ({ page, request }) => {
    const { payload } = await createUser(request);
    await loginWithStorage(page, payload);

    await page.goto("/dashboard");

    await page.getByRole("button", { name: "New Task" }).click();
    await page.getByPlaceholder("Task title").fill("Upload task");
    await page.getByRole("button", { name: "Create Task" }).click();

    const taskCard = page
      .getByRole("heading", { name: "Upload task" })
      .locator("xpath=ancestor::div[contains(@class,'glass-panel-hover')][1]");

    await taskCard.getByRole("button", { name: "Attach" }).click();

    await page.route("**/api/upload", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    const filePath = path.join(
      __dirname,
      "fixtures",
      "sample.pdf"
    );

    await page.setInputFiles("input[type='file']", filePath);

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("File uploaded successfully");
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Upload" }).click();
  });

  test("analytics page renders charts", async ({ page, request }) => {
    const { payload } = await createUser(request);
    await loginWithStorage(page, payload);

    await page.goto("/analytics");
    await expect(page.getByText("Analytics")).toBeVisible();
    await expect(page.getByText("Status bars")).toBeVisible();
    await expect(page.getByText("Action volume")).toBeVisible();
  });
});
