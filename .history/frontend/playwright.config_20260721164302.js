import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  timeout: 120000,

  reporter: [["html"]],

  use: {
    baseURL: "http://localhost:5173",

    headless: true,

    trace: "retain-on-failure",

    screenshot: "only-on-failure",
  },

  webServer: {
    command: "npm run dev -- --host 0.0.0.0",

    url: "http://localhost:5173",

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
