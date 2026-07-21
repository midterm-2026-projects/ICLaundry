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

  projects: [
    {
      name: "chromium",

      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
