// frontend/tests/e2e/setup.spec.js

import { test, expect } from "@playwright/test";

test.describe("Application Setup", () => {
  test.setTimeout(30000);

  test("application should load successfully", async ({ page }) => {
    await page.goto("/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await expect(page.locator("body")).toBeVisible();
  });
});
