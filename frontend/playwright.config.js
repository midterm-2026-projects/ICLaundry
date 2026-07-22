import { defineConfig, devices } from "@playwright/test";

import process from "node:process";

export default defineConfig({
  testDir: "./tests/e2e",

  testMatch: "**/*.spec.js",

  globalSetup: "./tests/e2e/globalSetup.js",

  globalTeardown: "./tests/e2e/globalTeardown.js",

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
    baseURL: "http://127.0.0.1:5173",

    headless: true,

    actionTimeout: 30_000,

    navigationTimeout: 60_000,

    screenshot: "only-on-failure",

    trace: "retain-on-failure",

    video: "retain-on-failure",
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
