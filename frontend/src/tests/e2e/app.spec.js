import { test, expect } from "@playwright/test";

test("home page renders primary CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Kanban")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
});

test("login page renders inputs", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Welcome back")).toBeVisible();
  await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("register page renders inputs", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByText("Create account")).toBeVisible();
  await expect(page.getByPlaceholder("johndoe")).toBeVisible();
  await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
});
