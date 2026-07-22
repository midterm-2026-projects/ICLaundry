import { expect, test } from "@playwright/test";

test.describe("Application Setup", () => {
  test("application should load successfully", async ({ page }) => {
    const requestFailures = [];

    page.on("requestfailed", (request) => {
      requestFailures.push({
        method: request.method(),

        url: request.url(),

        error: request.failure()?.errorText ?? "Unknown request error",
      });
    });

    page.on("pageerror", (error) => {
      console.error("[Browser JavaScript error]", error.message);
    });

    const response = await page.goto("/", {
      waitUntil: "domcontentloaded",

      timeout: 60_000,
    });

    expect(response).not.toBeNull();

    expect(
      response?.ok(),
      `Application failed to load.

URL: ${response?.url()}
Status: ${response?.status()}`,
    ).toBeTruthy();

    await expect(page.locator("body")).toBeVisible();

    const navigationButton = page
      .getByRole("button", {
        name: /customers|orders/i,
      })
      .first();

    await expect(navigationButton).toBeVisible({
      timeout: 30_000,
    });

    if (requestFailures.length > 0) {
      console.warn("[Application setup request failures]", requestFailures);
    }
  });
});
