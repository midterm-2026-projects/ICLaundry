import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  timeout: 120000,

  fullyParallel: false,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: "http://localhost:5173",

    trace: "retain-on-failure",

    screenshot: "only-on-failure",
  },

  webServer: [
    {
      command: "npm run dev",
      cwd: ".",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },

    {
      command: "npm start",
      cwd: "../backend",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
