import { test, expect } from "@playwright/test";

test.describe("Application Setup", () => {
  test("application should load successfully", async ({ page }) => {
    const response = await page.goto("/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    expect(response).not.toBeNull();
    expect(response?.ok()).toBeTruthy();

    await expect(page.locator("body")).toBeVisible();

    // Change this to an element that always appears in your application.
    await expect(
      page
        .getByRole("button", {
          name: /customers|orders/i,
        })
        .first(),
    ).toBeVisible({
      timeout: 30_000,
    });
  });
});
