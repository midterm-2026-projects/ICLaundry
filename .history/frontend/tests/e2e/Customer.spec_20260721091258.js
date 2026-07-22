import { test, expect } from "@playwright/test";

test.describe("Customer Management Workflow", () => {
  test("should successfully perform the complete customer workflow", async ({
    page,
  }) => {
    /**
     * ==============================================
     * ARRANGE
     * ==============================================
     */

    const customer = {
      name: `Playwright Customer ${Date.now()}`,
      phone: `09${Date.now().toString().slice(-9)}`,
      email: `playwright${Date.now()}@gmail.com`,
      address: "Pooc, Balayan",
    };

    const updatedName = `${customer.name} Updated`;

    /**
     * ==============================================
     * OPEN CUSTOMER PAGE
     * ==============================================
     */

    await page.goto("http://localhost:5173/");

    await page
      .getByRole("button", {
        name: /customers/i,
      })
      .click();

    /**
     * ==============================================
     * ADD CUSTOMER
     * ==============================================
     */

    await page
      .getByRole("button", {
        name: /\+ add customer/i,
      })
      .click();

    await page.getByLabel("Customer Name").fill(customer.name);

    await page.getByLabel("Phone Number").fill(customer.phone);

    await page.getByLabel("Email").fill(customer.email);

    await page.getByLabel("Address").fill(customer.address);

    await page
      .getByRole("button", {
        name: /create customer/i,
      })
      .click();

    await expect(page.getByText(customer.name)).toBeVisible();

    /**
     * ==============================================
     * EDIT CUSTOMER
     * ==============================================
     */

    const row = page.locator("tr").filter({
      hasText: customer.name,
    });

    await row
      .getByRole("button", {
        name: /edit/i,
      })
      .click();

    await page.getByLabel("Customer Name").fill(updatedName);

    await page
      .getByRole("button", {
        name: /update customer/i,
      })
      .click();

    await expect(page.getByText(updatedName)).toBeVisible();

    /**
     * ==============================================
     * DELETE CUSTOMER
     * ==============================================
     */

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    const updatedRow = page.locator("tr").filter({
      hasText: updatedName,
    });

    await updatedRow
      .getByRole("button", {
        name: /delete/i,
      })
      .click();

    await expect(page.getByText(updatedName)).not.toBeVisible();
  });
});
