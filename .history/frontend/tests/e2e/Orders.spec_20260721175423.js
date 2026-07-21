import { test, expect } from "@playwright/test";

test.describe.configure({
  mode: "serial",
});

/**
 * =====================================================
 * CUSTOMER MANAGEMENT WORKFLOW
 * =====================================================
 */

test.describe("Customer Management Workflow", () => {
  test.setTimeout(120000);

  test("should successfully perform the complete customer workflow", async ({
    page,
  }) => {
    const timestamp = Date.now();

    const customer = {
      name: `PW-CUSTOMER-${process.env.CI ? "CI" : "LOCAL"}-${timestamp}`,

      phone: `09${timestamp.toString().slice(-9)}`,

      email: `pw${timestamp}@gmail.com`,

      address: "Pooc, Balayan",
    };

    const updatedName = `${customer.name}-UPDATED`;

    await page.goto("/", {
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

    await page.getByLabel("Customer Name").fill(customer.name);

    await page.getByLabel("Phone Number").fill(customer.phone);

    await page.getByLabel("Email").fill(customer.email);

    await page.getByLabel("Address").fill(customer.address);

    const createResponse = page.waitForResponse((response) => {
      return (
        response.url().includes("/api/customers") &&
        response.request().method() === "POST"
      );
    });

    await page
      .getByRole("button", {
        name: /create customer/i,
      })
      .click();

    const customerResponse = await createResponse;

    expect(customerResponse.ok()).toBeTruthy();

    await page.reload({
      waitUntil: "networkidle",
    });

    await page
      .getByRole("button", {
        name: /customers/i,
      })
      .click()
      .catch(() => {});

    const customerRow = page.locator("tr").filter({
      hasText: customer.name,
    });

    await expect(customerRow).toBeVisible({
      timeout: 30000,
    });

    await customerRow
      .getByRole("button", {
        name: /edit/i,
      })
      .click();

    await page.getByLabel("Customer Name").fill(updatedName);

    const updateResponse = page.waitForResponse((response) => {
      return (
        response.url().includes("/api/customers") &&
        ["PUT", "PATCH"].includes(response.request().method())
      );
    });

    await page
      .getByRole("button", {
        name: /update customer/i,
      })
      .click();

    const updatedResponse = await updateResponse;

    expect(updatedResponse.ok()).toBeTruthy();

    await page.reload({
      waitUntil: "networkidle",
    });

    await page
      .getByRole("button", {
        name: /customers/i,
      })
      .click()
      .catch(() => {});

    const updatedRow = page.locator("tr").filter({
      hasText: updatedName,
    });

    await expect(updatedRow).toBeVisible({
      timeout: 30000,
    });

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await updatedRow
      .getByRole("button", {
        name: /delete/i,
      })
      .click();

    await expect(updatedRow).not.toBeVisible({
      timeout: 30000,
    });
  });
});

/**
 * =====================================================
 * ORDER MANAGEMENT WORKFLOW
 * =====================================================
 */

test.describe("Order Management End-to-End Testing", () => {
  test.setTimeout(120000);

  test("should successfully complete the entire order workflow", async ({
    page,
  }) => {
    const timestamp = Date.now();

    const customer = {
      name: `PW-ORDER-${process.env.CI ? "CI" : "LOCAL"}-${timestamp}`,

      phone: `09${timestamp.toString().slice(-9)}`,

      email: `order${timestamp}@gmail.com`,
    };

    const getOrderRow = () => {
      return page.locator("tbody tr").filter({
        hasText: customer.name,
      });
    };

    await page.goto("/", {
      waitUntil: "networkidle",
    });

    await page
      .getByRole("button", {
        name: /orders/i,
      })
      .click();

    await page
      .getByRole("button", {
        name: /new order/i,
      })
      .click();

    await page.getByPlaceholder("Client Name").fill(customer.name);

    await page.getByPlaceholder("Phone Number").fill(customer.phone);

    await page.getByPlaceholder("Email").fill(customer.email);

    await page.getByPlaceholder(/e\.g\. 3\.5/i).fill("20");

    const addon = page.locator(".addon-btn-add:not([disabled])").first();

    if (await addon.isVisible()) {
      await addon.click();
    }

    await page.getByPlaceholder("Amount Paid").fill("300");

    const orderResponse = page.waitForResponse((response) => {
      return (
        response.url().includes("/api/orders") &&
        response.request().method() === "POST"
      );
    });

    await page
      .getByRole("button", {
        name: /create order/i,
      })
      .click();

    const createdOrder = await orderResponse;

    expect(createdOrder.ok()).toBeTruthy();

    await page.waitForTimeout(3000);

    await page.reload({
      waitUntil: "networkidle",
    });

    await page
      .getByRole("button", {
        name: /orders/i,
      })
      .click()
      .catch(() => {});

    const row = getOrderRow();

    await expect(row).toBeVisible({
      timeout: 30000,
    });

    const moveStatus = async (expected) => {
      const button = row.locator(".status-next-btn");

      await expect(button).toBeVisible({
        timeout: 30000,
      });

      await button.click();

      await expect(row.locator(".status-track-label .badge")).toHaveText(
        new RegExp(expected, "i"),
        {
          timeout: 30000,
        },
      );
    };

    await moveStatus("Washing");

    await moveStatus("Drying");

    await moveStatus("Folding");

    await moveStatus("Ready");
  });
});
