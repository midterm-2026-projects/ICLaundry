import { test, expect } from "@playwright/test";

const generateCustomer = () => {
  const id = Date.now();

  return {
    name: `Playwright Customer ${id}`,
    phone: `09${id.toString().slice(-9)}`,
    email: `playwright${id}@gmail.com`,
    address: "Pooc, Balayan",
  };
};

const reloadAndWait = async (page) => {
  await page.reload({
    waitUntil: "networkidle",
  });
};

/*
==================================================
CUSTOMER TEST
==================================================
*/

test.describe("Customer Management Workflow", () => {
  test("should successfully perform the complete customer workflow", async ({
    page,
  }) => {
    const customer = generateCustomer();

    const updatedName = `${customer.name} Updated`;

    await page.goto("http://localhost:5173/");

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

    const createRequest = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/customers"),
    );

    await page
      .getByRole("button", {
        name: /create customer/i,
      })
      .click();

    await createRequest;

    await reloadAndWait(page);

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

    const updateRequest = page.waitForResponse(
      (response) =>
        response.request().method() === "PUT" &&
        response.url().includes("/customers"),
    );

    await page
      .getByRole("button", {
        name: /update customer/i,
      })
      .click();

    await updateRequest;

    await reloadAndWait(page);

    await expect(
      page.getByText(updatedName, {
        exact: true,
      }),
    ).toBeVisible({
      timeout: 30000,
    });

    page.once("dialog", (dialog) => dialog.accept());

    await page
      .locator("tr")
      .filter({
        hasText: updatedName,
      })
      .getByRole("button", {
        name: /delete/i,
      })
      .click();

    await reloadAndWait(page);

    await expect(
      page.getByText(updatedName, {
        exact: true,
      }),
    ).not.toBeVisible({
      timeout: 30000,
    });
  });
});

/*
==================================================
ORDER TEST
==================================================
*/

test.describe("Order Management End-to-End Testing", () => {
  test("should successfully complete the entire order workflow", async ({
    page,
  }) => {
    test.setTimeout(120000);

    const customer = generateCustomer();

    await page.goto("http://localhost:5173/", {
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

    await page.locator(".addon-btn-add:not([disabled])").first().click();

    await page.getByPlaceholder("Amount Paid").fill("300");

    const createOrderRequest = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/orders"),
    );

    await page
      .getByRole("button", {
        name: /create order/i,
      })
      .click();

    await createOrderRequest;

    await reloadAndWait(page);

    const orderRow = page.locator("tbody tr").filter({
      hasText: customer.name,
    });

    await expect(orderRow).toBeVisible({
      timeout: 30000,
    });
  });
});
