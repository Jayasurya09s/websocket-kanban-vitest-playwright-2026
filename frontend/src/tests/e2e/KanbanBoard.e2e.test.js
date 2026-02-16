import { test, expect } from "@playwright/test";

const API_BASE_URL =
  process.env.PLAYWRIGHT_API_BASE_URL ||
  "https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com/api";

const createUser = async (request) => {
  const suffix = Date.now();
  const email = `e2e-${suffix}@kanban.test`;
  const password = "Test1234!";
  const username = `e2e_${suffix}`;

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

test("user can create, move, update, and delete a task", async ({ page, request }) => {
  const { payload } = await createUser(request);
  await loginWithStorage(page, payload);

  await page.goto("/dashboard");
  await expect(page.getByText("Project Board")).toBeVisible();

  await page.getByRole("button", { name: "New Task" }).click();
  await page.getByPlaceholder("Task title").fill("E2E Task");
  await page.getByPlaceholder("Description (optional)").fill("Playwright created task");
  await page.getByRole("combobox").first().selectOption("high");
  await page.getByRole("combobox").nth(1).selectOption("bug");
  await page.getByRole("button", { name: "Create Task" }).click();

  const taskHeading = page.getByRole("heading", { name: "E2E Task" });
  await expect(taskHeading).toBeVisible();

  const inProgressColumn = page
    .locator("h3", { hasText: "In Progress" })
    .locator("xpath=ancestor::div[contains(@class,'min-w-70')]");

  await page.dragAndDrop(
    "h4:has-text('E2E Task')",
    inProgressColumn
  );

  const taskCard = taskHeading.locator(
    "xpath=ancestor::div[contains(@class,'glass-panel-hover')][1]"
  );
  const statusSelect = taskCard.locator("select");

  await expect(statusSelect).toHaveValue("in-progress");
  await statusSelect.selectOption("done");
  await expect(statusSelect).toHaveValue("done");

  await taskCard.getByTitle("Delete task").click();
  await expect(page.getByRole("heading", { name: "E2E Task" })).toHaveCount(0);
});
