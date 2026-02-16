import { test, expect } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await expect(page.getByText("Login")).toBeVisible();
});

test("dashboard redirect after login", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  await page.fill('input[placeholder="Email"]',"test@test.com");
  await page.fill('input[placeholder="Password"]',"123456");

  await page.click("button:has-text('Login')");

  await page.waitForTimeout(2000);
});
