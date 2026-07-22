import { test, expect } from "@playwright/test";

test.describe("Application Setup", () => {
  test("application should load successfully", async ({ page }) => {
    await page.goto("/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await expect(page).toHaveURL("/");

    await expect(page.locator("body")).toBeVisible();
  });
});
