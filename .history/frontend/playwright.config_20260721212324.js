import { defineConfig, devices } from "@playwright/test";

import process from "node:process";

const frontendURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";

export default defineConfig({
  testDir: "./tests/e2e",

  testMatch: "**/*.spec.js",

  fullyParallel: false,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 120_000,

  expect: {
    timeout: 30_000,
  },

  reporter: [
    ["list"],

    [
      "html",
      {
        outputFolder: "playwright-report",

        open: "never",
      },
    ],
  ],

  use: {
    baseURL: frontendURL,

    headless: true,

    actionTimeout: 30_000,

    navigationTimeout: 60_000,

    trace: "retain-on-failure",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173",

    url: frontendURL,

    reuseExistingServer: !process.env.CI,

    timeout: 120_000,

    stdout: "pipe",

    stderr: "pipe",
  },

  projects: [
    {
      name: "chromium",

      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  outputDir: "test-results",
});
