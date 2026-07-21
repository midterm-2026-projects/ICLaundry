import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

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
    /*
     * IMPORTANT FOR GITHUB ACTIONS
     * Run chromium without GUI
     */
    headless: true,

    baseURL: "http://127.0.0.1:5173",

    trace: "retain-on-failure",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev -- --host 0.0.0.0",

    url: "http://127.0.0.1:5173",

    reuseExistingServer: !process.env.CI,

    timeout: 120000,
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
