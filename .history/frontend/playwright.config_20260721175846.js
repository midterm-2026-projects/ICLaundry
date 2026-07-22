import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  fullyParallel: false,

  retries: 0,

  workers: 1,

  reporter: [["list"], ["html"]],

  use: {
    baseURL: "http://localhost:5173",

    headless: false,

    viewport: {
      width: 1440,
      height: 900,
    },

    actionTimeout: 10000,

    navigationTimeout: 30000,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
