import { expect, test } from "@playwright/test";

/**
 * Print browser and API errors in the GitHub Actions log.
 */
const attachDiagnostics = (page) => {
  page.on("console", (message) => {
    console.log(`[Browser ${message.type()}]`, message.text());
  });

  page.on("pageerror", (error) => {
    console.error("[Browser JavaScript error]", error.message);
  });

  page.on("requestfailed", (request) => {
    console.error("[Browser request failed]", {
      method: request.method(),
      url: request.url(),
      error: request.failure()?.errorText ?? "Unknown request error",
    });
  });

  page.on("response", async (response) => {
    if (response.status() < 400) {
      return;
    }

    const responseBody = await response
      .text()
      .catch(() => "Unable to read response body");

    console.error("[Failed HTTP response]", {
      method: response.request().method(),
      url: response.url(),
      status: response.status(),
      body: responseBody,
    });
  });
};

/**
 * Open the application.
 */
const openPage = async (page) => {
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
};

/**
 * Perform an action and capture its API response.
 *
 * The response predicate intentionally does not require a 2xx status.
 * This allows Playwright to report actual 400, 404, or 500 responses
 * instead of waiting until timeout.
 */
const performAPIAction = async ({
  page,
  action,
  methods,
  description,
  urlPattern,
}) => {
  const responsePromise = page.waitForResponse(
    (response) => {
      const method = response.request().method();

      const methodMatches = methods.includes(method);

      const urlMatches =
        !urlPattern ||
        response.url().toLowerCase().includes(urlPattern.toLowerCase());

      return methodMatches && urlMatches;
    },
    {
      timeout: 30_000,
    },
  );

  await action();

  const response = await responsePromise;

  const responseBody = await response.text().catch(() => "");

  console.log(`[E2E API] ${description}`, {
    method: response.request().method(),

    url: response.url(),

    status: response.status(),

    body: responseBody,
  });

  expect(
    response.status(),
    `${description} failed.

Method: ${response.request().method()}
URL: ${response.url()}
Status: ${response.status()}
Response: ${responseBody}`,
  ).toBeGreaterThanOrEqual(200);

  expect(
    response.status(),
    `${description} failed.

Method: ${response.request().method()}
URL: ${response.url()}
Status: ${response.status()}
Response: ${responseBody}`,
  ).toBeLessThan(300);

  return response;
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
    attachDiagnostics(page);

    const timestamp = Date.now();

    const uniqueDigits = timestamp.toString().slice(-9);

    const customer = {
      name: `Playwright Customer ${timestamp}`,

      phone: `09${uniqueDigits}`,

      email: `playwright${timestamp}@example.com`,

      address: "Pooc, Balayan",
    };

    const updatedName = `${customer.name} Updated`;

    await openPage(page);

    const customersButton = page.getByRole("button", {
      name: /customers/i,
    });

    await expect(customersButton).toBeVisible({
      timeout: 30_000,
    });

    await customersButton.click();

    const addCustomerButton = page.getByRole("button", {
      name: /add customer/i,
    });

    await expect(addCustomerButton).toBeVisible({
      timeout: 30_000,
    });

    await addCustomerButton.click();

    await page.getByLabel("Customer Name").fill(customer.name);

    await page.getByLabel("Phone Number").fill(customer.phone);

    await page.getByLabel("Email").fill(customer.email);

    await page.getByLabel("Address").fill(customer.address);

    await performAPIAction({
      page,

      methods: ["POST"],

      description: "Create customer",

      // This matches both /customer and /customers.
      urlPattern: "customer",

      action: async () => {
        const createButton = page.getByRole("button", {
          name: /create customer/i,
        });

        await expect(createButton).toBeEnabled();

        await createButton.click();
      },
    });

    const customerRow = page.locator("tbody tr").filter({
      hasText: customer.name,
    });

    await expect(customerRow).toBeVisible({
      timeout: 30_000,
    });

    const editButton = customerRow.getByRole("button", {
      name: /edit/i,
    });

    await expect(editButton).toBeVisible();

    await editButton.click();

    const customerNameInput = page.getByLabel("Customer Name");

    await expect(customerNameInput).toBeVisible();

    await customerNameInput.fill(updatedName);

    await performAPIAction({
      page,

      methods: ["PUT", "PATCH"],

      description: "Update customer",

      urlPattern: "customer",

      action: async () => {
        const updateButton = page.getByRole("button", {
          name: /update customer/i,
        });

        await expect(updateButton).toBeEnabled();

        await updateButton.click();
      },
    });

    const updatedRow = page.locator("tbody tr").filter({
      hasText: updatedName,
    });

    await expect(updatedRow).toBeVisible({
      timeout: 30_000,
    });

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await performAPIAction({
      page,

      methods: ["DELETE"],

      description: "Delete customer",

      urlPattern: "customer",

      action: async () => {
        const deleteButton = updatedRow.getByRole("button", {
          name: /delete/i,
        });

        await expect(deleteButton).toBeVisible();

        await deleteButton.click();
      },
    });

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
    attachDiagnostics(page);

    const timestamp = Date.now();

    const uniqueDigits = timestamp.toString().slice(-9);

    const customer = {
      name: `Playwright Order Customer ${timestamp}`,

      phone: `09${uniqueDigits}`,

      email: `playwrightorder${timestamp}@example.com`,
    };

    const getOrderRow = () =>
      page.locator("tbody tr").filter({
        hasText: customer.name,
      });

    await openPage(page);

    const ordersButton = page.getByRole("button", {
      name: /orders/i,
    });

    await expect(ordersButton).toBeVisible({
      timeout: 30_000,
    });

    await ordersButton.click();

    const newOrderButton = page.getByRole("button", {
      name: /new order/i,
    });

    await expect(newOrderButton).toBeVisible({
      timeout: 30_000,
    });

    await newOrderButton.click();

    await page.getByPlaceholder("Client Name").fill(customer.name);

    await page.getByPlaceholder("Phone Number").fill(customer.phone);

    await page.getByPlaceholder("Email").fill(customer.email);

    await page.getByPlaceholder(/e\.g\. 3\.5/i).fill("20");

    const addon = page.locator(".addon-btn-add:not([disabled])").first();

    if (await addon.isVisible().catch(() => false)) {
      await addon.click();
    }

    await page.getByPlaceholder("Amount Paid").fill("300");

    await performAPIAction({
      page,

      methods: ["POST"],

      description: "Create order",

      urlPattern: "order",

      action: async () => {
        const createOrderButton = page.getByRole("button", {
          name: /create order/i,
        });

        await expect(createOrderButton).toBeEnabled();

        await createOrderButton.click();
      },
    });

    const orderRow = getOrderRow();

    await expect(orderRow).toBeVisible({
      timeout: 30_000,
    });

    const moveStatus = async (expectedStatus) => {
      const currentRow = getOrderRow();

      await expect(currentRow).toBeVisible({
        timeout: 30_000,
      });

      const statusButton = currentRow.locator(".status-next-btn");

      await expect(statusButton).toBeVisible({
        timeout: 30_000,
      });

      await performAPIAction({
        page,

        methods: ["PUT", "PATCH"],

        description: `Move order status to ${expectedStatus}`,

        urlPattern: "order",

        action: async () => {
          await statusButton.click();
        },
      });

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
