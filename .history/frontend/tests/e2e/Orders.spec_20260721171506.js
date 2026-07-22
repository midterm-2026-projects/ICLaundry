import { test, expect } from "@playwright/test";

/**
 * ==============================================
 * CUSTOMER MANAGEMENT WORKFLOW
 * ==============================================
 */

test.describe("Customer Management Workflow", () => {
  test.setTimeout(120000);

  test("should successfully perform the complete customer workflow", async ({
    page,
  }) => {
    const timestamp = Date.now();

    const customer = {
      name: `Playwright Customer ${timestamp}`,
      phone: `09${timestamp.toString().slice(-9)}`,
      email: `playwright${timestamp}@gmail.com`,
      address: "Pooc, Balayan",
    };

    const updatedName = `${customer.name} Updated`;

    await page.goto("http://localhost:5173/", {
      waitUntil: "networkidle",
    });

    await page
      .getByRole("button", {
        name: /customers/i,
      })
      .click();

    await page
      .getByRole("button", {
        name: /add customer/i,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: /customer/i,
      }),
    ).toBeVisible({
      timeout: 15000,
    });

    await page.getByLabel("Customer Name").fill(customer.name);

    await page.getByLabel("Phone Number").fill(customer.phone);

    await page.getByLabel("Email").fill(customer.email);

    await page.getByLabel("Address").fill(customer.address);

    await page
      .getByRole("button", {
        name: /create customer/i,
      })
      .click();

    await expect(page.getByText(customer.name)).toBeVisible({
      timeout: 15000,
    });

    const customerRow = page.locator("tr").filter({
      hasText: customer.name,
    });

    await customerRow
      .getByRole("button", {
        name: /edit/i,
      })
      .click();

    await expect(page.getByLabel("Customer Name")).toBeVisible();

    await page.getByLabel("Customer Name").fill(updatedName);

    await page
      .getByRole("button", {
        name: /update customer/i,
      })
      .click();

    await expect(page.getByText(updatedName)).toBeVisible({
      timeout: 15000,
    });

    page.on("dialog", async (dialog) => {
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

    await expect(page.getByText(updatedName)).not.toBeVisible({
      timeout: 15000,
    });
  });
});

/**
 * ==============================================
 * ORDER MANAGEMENT WORKFLOW
 * ==============================================
 */

test.describe("Order Management End-to-End Testing", () => {
  test.setTimeout(120000);

  test("should successfully complete the entire order workflow", async ({
    page,
  }) => {
    const timestamp = Date.now();

    const customer = {
      name: `Playwright Customer ${timestamp}`,

      phone: `09${timestamp.toString().slice(-9)}`,

      email: `playwright${timestamp}@gmail.com`,
    };

    const getOrderRow = () =>
      page.locator("tbody tr").filter({
        hasText: customer.name,
      });

    await page.goto("http://localhost:5173/", {
      waitUntil: "networkidle",
    });

    await page
      .getByRole("button", {
        name: /^orders$/i,
      })
      .click();

    await page
      .getByRole("button", {
        name: /new order/i,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: /new order/i,
      }),
    ).toBeVisible();

    await page.getByPlaceholder("Client Name").fill(customer.name);

    await page.getByPlaceholder("Phone Number").fill(customer.phone);

    await page.getByPlaceholder("Email").fill(customer.email);

    await page.getByPlaceholder(/e\.g\. 3\.5/i).fill("20");

    const addon = page.locator(".addon-btn-add:not([disabled])").first();

    if (await addon.isVisible()) {
      await addon.click();
    }

    await page.getByPlaceholder("Amount Paid").fill("300");

    await page
      .getByRole("button", {
        name: /create order/i,
      })
      .click();

    await expect(getOrderRow()).toBeVisible({
      timeout: 20000,
    });

    /**
     * STATUS FLOW
     */

    const moveStatus = async (expectedStatus, label) => {
      const row = getOrderRow();

      const button = row.locator(".status-next-btn");

      await expect(button).toBeVisible({
        timeout: 15000,
      });

      await expect(button).toHaveAttribute(
        "title",
        new RegExp(`Move to ${label}`, "i"),
      );

      await button.click();

      await expect(row.locator(".status-track-label .badge")).toHaveText(
        new RegExp(label, "i"),
        {
          timeout: 15000,
        },
      );
    };

    await moveStatus("washing", "Washing");

    await moveStatus("drying", "Drying");

    await moveStatus("folding", "Folding");

    await moveStatus("ready", "Ready for pick-up");
  });
});
