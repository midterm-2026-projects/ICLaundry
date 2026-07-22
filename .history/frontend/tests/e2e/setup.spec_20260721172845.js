import { test, expect } from "@playwright/test";

test("application should load successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("http://localhost:5173/");
});
