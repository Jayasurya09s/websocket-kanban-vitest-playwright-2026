// playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e", // Path to your test files
  timeout: 20 * 1000, // Test timeout in milliseconds
  use: {
    headless: true, // Run tests in headless mode
    baseURL: "http://localhost:3000", // Replace with your app's base URL
    viewport: { width: 1300, height: 720 }, // Default viewport
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
