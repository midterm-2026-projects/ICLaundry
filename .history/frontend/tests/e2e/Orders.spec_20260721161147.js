import { test, expect } from "@playwright/test";

/**
 * ==============================================
 * CUSTOMER MANAGEMENT WORKFLOW
 * ==============================================
 */

test.describe("Customer Management Workflow", () => {
  test("should successfully perform the complete customer workflow", async ({
    page,
  }) => {
    const customer = {
      name: `Playwright Customer ${Date.now()}`,
      phone: `09${Date.now().toString().slice(-9)}`,
      email: `playwright${Date.now()}@gmail.com`,
      address: "Pooc, Balayan",
    };

    const updatedName = `${customer.name} Updated`;

    await page.goto("http://localhost:5173/");

    await page
      .getByRole("button", {
        name: /customers/i,
      })
      .click();

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

/**
 * ==============================================
 * ORDER MANAGEMENT WORKFLOW
 * ==============================================
 */

test.describe("Order Management End-to-End Testing", () => {
  const timestamp = Date.now();

  const customer = {
    name: `Playwright Customer ${timestamp}`,

    phone: `09${timestamp.toString().slice(-9)}`,

    email: `playwright${timestamp}@gmail.com`,
  };

  const getOrderRow = (page) =>
    page.locator("tbody tr").filter({
      hasText: customer.name,
    });

  const parseCurrency = (value) => {
    const parsedValue = Number(String(value).replace(/[^\d.-]/g, ""));

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  const moveToNextStatus = async (
    page,
    expectedStatusValue,
    expectedStatusLabel,
  ) => {
    const row = getOrderRow(page);

    await expect(row).toBeVisible({
      timeout: 15000,
    });

    const currentStatusBadge = row.locator(".status-track-label .badge");

    const nextStatusButton = row.locator(".status-next-btn");

    await expect(nextStatusButton).toBeVisible({
      timeout: 10000,
    });

    await expect(nextStatusButton).toHaveAttribute(
      "title",
      new RegExp(`^Move to ${expectedStatusLabel}$`, "i"),
    );

    const responsePromise = page.waitForResponse(
      (response) => {
        const request = response.request();

        const url = new URL(response.url());

        if (
          request.method() !== "PATCH" ||
          !/\/api\/orders\/[^/]+\/status\/?$/.test(url.pathname)
        ) {
          return false;
        }

        let body;

        try {
          body = request.postDataJSON();
        } catch {
          return false;
        }

        return (
          String(body?.status || "").toLowerCase() ===
          expectedStatusValue.toLowerCase()
        );
      },
      {
        timeout: 15000,
      },
    );

    await nextStatusButton.click();

    const response = await responsePromise;

    expect(response.ok()).toBeTruthy();

    await expect(currentStatusBadge).toHaveText(
      new RegExp(`^${expectedStatusLabel}$`, "i"),
      {
        timeout: 15000,
      },
    );
  };

  test("should successfully complete the entire order workflow", async ({
    page,
  }) => {
    test.setTimeout(120000);

    await page.goto("http://localhost:5173/", {
      waitUntil: "domcontentloaded",
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

    await page.getByPlaceholder("Client Name").fill(customer.name);

    await page.getByPlaceholder("Phone Number").fill(customer.phone);

    await page.getByPlaceholder("Email").fill(customer.email);

    await page.getByPlaceholder(/e\.g\. 3\.5/i).fill("20");

    await page.locator(".addon-btn-add:not([disabled])").first().click();

    await page.getByPlaceholder("Amount Paid").fill("300");

    await page
      .getByRole("button", {
        name: /create order/i,
      })
      .click();

    await expect(getOrderRow(page)).toBeVisible({
      timeout: 15000,
    });

    await moveToNextStatus(page, "washing", "Washing");

    await moveToNextStatus(page, "drying", "Drying");

    await moveToNextStatus(page, "folding", "Folding");

    await moveToNextStatus(page, "ready", "Ready for pick-up");
  });
});
