import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", name: "Dashboard", heading: "Business Dashboard" },
  { path: "/orders", name: "Orders", heading: "Orders" },
  { path: "/customers", name: "Customers", heading: "Customers" },
  { path: "/staff", name: "Staff", heading: "Staff" },
  { path: "/inventory", name: "Inventory", heading: "Inventory" },
  { path: "/analytics", name: "Analytics", heading: "Analytics Dashboard" },
  { path: "/settings", name: "Settings", heading: "Settings" },
];

test.describe("Final interface acceptance", () => {
  test("primary navigation reaches every application module", async ({ page }) => {
    await page.goto("/");

    for (const destination of pages.slice(1)) {
      await page.getByRole("button", { name: destination.name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${destination.path}$`));
      await expect(page.getByRole("heading", { name: destination.heading, exact: true })).toBeVisible();
    }

    await page.getByRole("button", { name: "Dashboard", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("every module fits a mobile viewport without page-level horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const destination of pages) {
      await page.goto(destination.path);
      await expect(page.getByRole("heading", { name: destination.heading, exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();

      const overflow = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));

      expect(overflow.document, `${destination.name} document overflows horizontally`).toBeLessThanOrEqual(overflow.viewport + 1);
      expect(overflow.body, `${destination.name} body overflows horizontally`).toBeLessThanOrEqual(overflow.viewport + 1);
    }
  });

  test("mobile navigation opens, closes with Escape, and identifies the active page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/analytics");

    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation").getByRole("button", { name: "Analytics" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
