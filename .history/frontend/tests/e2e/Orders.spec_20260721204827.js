import { test, expect } from "@playwright/test";

test.describe.configure({
  mode: "serial",
});

const openPage = async (page) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();

  await expect(page.locator("body")).toBeVisible();
};

/**
 * =====================================================
 * CUSTOMER MANAGEMENT WORKFLOW
 * =====================================================
 */

test.describe("Customer Management Workflow", () => {
  test("should successfully perform the complete customer workflow", async ({
    page,
  }) => {
    const timestamp = Date.now();

    const customer = {
      name: `Playwright Customer ${timestamp}`,
      phone: `09${timestamp.toString().slice(-9)}`,
      email: `playwright${timestamp}@example.com`,
      address: "Pooc, Balayan",
    };

    const updatedName = `${customer.name} Updated`;

    await openPage(page);

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

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.status() >= 200 &&
        response.status() < 300,
      {
        timeout: 30_000,
      },
    );

    await page
      .getByRole("button", {
        name: /create customer/i,
      })
      .click();

    await createResponsePromise;

    const customerRow = page.locator("tbody tr").filter({
      hasText: customer.name,
    });

    await expect(customerRow).toBeVisible({
      timeout: 30_000,
    });

    await customerRow
      .getByRole("button", {
        name: /edit/i,
      })
      .click();

    await page.getByLabel("Customer Name").fill(updatedName);

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        ["PUT", "PATCH"].includes(response.request().method()) &&
        response.status() >= 200 &&
        response.status() < 300,
      {
        timeout: 30_000,
      },
    );

    await page
      .getByRole("button", {
        name: /update customer/i,
      })
      .click();

    await updateResponsePromise;

    const updatedRow = page.locator("tbody tr").filter({
      hasText: updatedName,
    });

    await expect(updatedRow).toBeVisible({
      timeout: 30_000,
    });

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    const deleteResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === "DELETE" &&
        response.status() >= 200 &&
        response.status() < 300,
      {
        timeout: 30_000,
      },
    );

    await updatedRow
      .getByRole("button", {
        name: /delete/i,
      })
      .click();

    await deleteResponsePromise;

    await expect(updatedRow).toHaveCount(0, {
      timeout: 30_000,
    });
  });
});

/**
 * =====================================================
 * ORDER MANAGEMENT WORKFLOW
 * =====================================================
 */

test.describe("Order Management End-to-End Testing", () => {
  test("should successfully complete the entire order workflow", async ({
    page,
  }) => {
    const timestamp = Date.now();

    const customer = {
      name: `Playwright Customer ${timestamp}`,
      phone: `09${timestamp.toString().slice(-9)}`,
      email: `playwright${timestamp}@example.com`,
    };

    const getOrderRow = () =>
      page.locator("tbody tr").filter({
        hasText: customer.name,
      });

    await openPage(page);

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

    const createOrderResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.status() >= 200 &&
        response.status() < 300,
      {
        timeout: 30_000,
      },
    );

    await page
      .getByRole("button", {
        name: /create order/i,
      })
      .click();

    await createOrderResponsePromise;

    const orderRow = getOrderRow();

    await expect(orderRow).toBeVisible({
      timeout: 30_000,
    });

    const moveStatus = async (expectedStatus) => {
      const currentRow = getOrderRow();
      const button = currentRow.locator(".status-next-btn");

      await expect(button).toBeVisible({
        timeout: 30_000,
      });

      const responsePromise = page.waitForResponse(
        (response) =>
          ["PUT", "PATCH"].includes(response.request().method()) &&
          response.status() >= 200 &&
          response.status() < 300,
        {
          timeout: 30_000,
        },
      );

      await button.click();

      await responsePromise;

      await expect(currentRow.locator(".status-track-label .badge")).toHaveText(
        new RegExp(expectedStatus, "i"),
        {
          timeout: 30_000,
        },
      );
    };

    await moveStatus("Washing");
    await moveStatus("Drying");
    await moveStatus("Folding");
    await moveStatus("Ready");
  });
});
