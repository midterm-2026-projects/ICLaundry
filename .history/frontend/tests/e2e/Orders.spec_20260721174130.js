import { test, expect } from "@playwright/test";

/**
 * ==============================================
 * ORDER MANAGEMENT END-TO-END TESTING
 * ==============================================
 */

test.describe("Order Management End-to-End Testing", () => {
  /**
   * ==============================================
   * TEST DATA
   * ==============================================
   */

  const timestamp = Date.now();

  const customer = {
    name: `Playwright Customer ${timestamp}`,
    phone: `09${timestamp.toString().slice(-9)}`,
    email: `playwright${timestamp}@gmail.com`,
  };

  /**
   * ==============================================
   * FIND ORDER ROW
   * ==============================================
   */

  const getOrderRow = (page) =>
    page.locator("tbody tr").filter({
      hasText: customer.name,
    });

  /**
   * ==============================================
   * CONVERT CURRENCY TEXT TO NUMBER
   * ==============================================
   */

  const parseCurrency = (value) => {
    const parsedValue = Number(String(value).replace(/[^\d.-]/g, ""));

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  /**
   * ==============================================
   * MOVE ORDER TO NEXT STATUS
   * ==============================================
   */

  const moveToNextStatus = async (
    page,
    expectedStatusValue,
    expectedStatusLabel,
  ) => {
    const row = getOrderRow(page);

    await expect(row).toBeVisible({
      timeout: 15_000,
    });

    const currentStatusBadge = row.locator(".status-track-label .badge");

    const nextStatusButton = row.locator(".status-next-btn");

    await expect(nextStatusButton).toBeVisible({
      timeout: 10_000,
    });

    /*
     * Check the user-visible button label.
     */
    await expect(nextStatusButton).toHaveAttribute(
      "title",
      new RegExp(`^Move to ${expectedStatusLabel}$`, "i"),
    );

    /*
     * Wait for the exact status request.
     *
     * API values:
     * washing
     * drying
     * folding
     * ready
     * released
     */
    const statusResponsePromise = page.waitForResponse(
      (response) => {
        const request = response.request();
        const url = new URL(response.url());

        const isStatusEndpoint = /\/api\/orders\/[^/]+\/status\/?$/.test(
          url.pathname,
        );

        if (request.method() !== "PATCH" || !isStatusEndpoint) {
          return false;
        }

        let requestBody;

        try {
          requestBody = request.postDataJSON();
        } catch {
          return false;
        }

        return (
          String(requestBody?.status || "").toLowerCase() ===
          expectedStatusValue.toLowerCase()
        );
      },
      {
        timeout: 15_000,
      },
    );

    await nextStatusButton.click();

    const statusResponse = await statusResponsePromise;

    const responseBody = await statusResponse.text().catch(() => "");

    expect(
      statusResponse.ok(),
      [
        "Order status API request failed.",
        `Expected status: ${expectedStatusValue}`,
        `HTTP status: ${statusResponse.status()}`,
        `URL: ${statusResponse.url()}`,
        `Response: ${responseBody}`,
      ].join("\n"),
    ).toBeTruthy();

    /*
     * Check the user-visible status label.
     */
    await expect(currentStatusBadge).toHaveText(
      new RegExp(`^${expectedStatusLabel}$`, "i"),
      {
        timeout: 15_000,
      },
    );

    /*
     * Make sure the next action has changed before
     * the following workflow step begins.
     */
    await expect(nextStatusButton).not.toHaveAttribute(
      "title",
      new RegExp(`^Move to ${expectedStatusLabel}$`, "i"),
      {
        timeout: 15_000,
      },
    );
  };

  /**
   * ==============================================
   * COMPLETE ORDER WORKFLOW
   * ==============================================
   */

  test("should successfully complete the entire order workflow", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    /**
     * ==============================================
     * DEBUG LOGGING
     * ==============================================
     */

    page.on("console", (message) => {
      console.log(`[Browser ${message.type()}]`, message.text());
    });

    page.on("pageerror", (error) => {
      console.error("[Browser error]", error.message);
    });

    page.on("requestfailed", (request) => {
      console.error(
        "[Request failed]",
        request.method(),
        request.url(),
        request.failure()?.errorText,
      );
    });

    /**
     * ==============================================
     * HANDLE ALERTS
     * ==============================================
     */

    page.on("dialog", async (dialog) => {
      console.log(`[Dialog ${dialog.type()}]`, dialog.message());

      await dialog.accept();
    });

    /**
     * ==============================================
     * OPEN APPLICATION
     * ==============================================
     */

    await page.goto("http://localhost:5173/", {
      waitUntil: "domcontentloaded",
    });

    await page
      .getByRole("button", {
        name: /^orders$/i,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: /^orders$/i,
      }),
    ).toBeVisible({
      timeout: 15_000,
    });

    /**
     * ==============================================
     * CREATE ORDER
     * ==============================================
     */

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

    const availableAddonButton = page
      .locator(".addon-btn-add:not([disabled])")
      .first();

    await expect(availableAddonButton).toBeVisible();

    await availableAddonButton.click();

    await page.locator('select[name="payment_method"]').selectOption("cash");

    await page.getByPlaceholder("Amount Paid").fill("300");

    await page
      .getByRole("button", {
        name: /create order/i,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: /new order/i,
      }),
    ).not.toBeVisible({
      timeout: 15_000,
    });

    /**
     * ==============================================
     * VERIFY ORDER CREATED
     * ==============================================
     */

    await expect(getOrderRow(page)).toBeVisible({
      timeout: 15_000,
    });

    /**
     * ==============================================
     * EDIT ORDER
     * ==============================================
     */

    const createdOrderRow = getOrderRow(page);

    await createdOrderRow.getByTitle("Edit").click();

    await expect(
      page.getByRole("heading", {
        name: /edit order/i,
      }),
    ).toBeVisible();

    await page.getByLabel(/weight/i).fill("25");

    await page.getByLabel(/amount paid/i).fill("400");

    await page
      .getByRole("button", {
        name: /update order/i,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: /edit order/i,
      }),
    ).not.toBeVisible({
      timeout: 15_000,
    });

    await expect(getOrderRow(page)).toBeVisible();

    await expect(getOrderRow(page)).toContainText(/25kg/i);

    /**
     * ==============================================
     * STATUS WORKFLOW
     * ==============================================
     */

    await moveToNextStatus(page, "washing", "Washing");

    await moveToNextStatus(page, "drying", "Drying");

    await moveToNextStatus(page, "folding", "Folding");

    await moveToNextStatus(page, "ready", "Ready for pick-up");

    /**
     * ==============================================
     * OPEN PAYMENT DETAILS
     * ==============================================
     */

    const readyOrderRow = getOrderRow(page);

    const readyStatusBadge = readyOrderRow.locator(
      ".status-track-label .badge",
    );

    await expect(readyStatusBadge).toHaveText(/ready for pick-up/i, {
      timeout: 15_000,
    });

    await readyOrderRow
      .getByRole("button", {
        name: /^view$/i,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: /order details/i,
      }),
    ).toBeVisible({
      timeout: 15_000,
    });

    /**
     * ==============================================
     * COMPLETE PAYMENT
     * ==============================================
     */

    const paymentSection = page.locator(".order-section").filter({
      hasText: "Remaining Balance",
    });

    await expect(paymentSection).toBeVisible();

    const remainingBalanceText = await paymentSection
      .locator(".pricing-total span")
      .last()
      .innerText();

    const remainingBalance = parseCurrency(remainingBalanceText);

    expect(
      remainingBalance,
      `Expected a remaining balance but received: ${remainingBalanceText}`,
    ).toBeGreaterThan(0);

    await paymentSection
      .getByPlaceholder(/enter amount/i)
      .fill(remainingBalance.toFixed(2));

    await paymentSection.getByRole("combobox").selectOption("cash");

    const paymentResponsePromise = page.waitForResponse(
      (response) => {
        const request = response.request();

        const method = request.method();

        const url = response.url().toLowerCase();

        return (
          ["POST", "PATCH", "PUT"].includes(method) && url.includes("payment")
        );
      },
      {
        timeout: 15_000,
      },
    );

    await paymentSection
      .getByRole("button", {
        name: /submit payment/i,
      })
      .click();

    const paymentResponse = await paymentResponsePromise;

    const paymentResponseBody = await paymentResponse.text().catch(() => "");

    expect(
      paymentResponse.ok(),
      [
        "Payment API request failed.",
        `Status: ${paymentResponse.status()}`,
        `URL: ${paymentResponse.url()}`,
        `Response: ${paymentResponseBody}`,
      ].join("\n"),
    ).toBeTruthy();

    await expect(
      page.getByRole("heading", {
        name: /order details/i,
      }),
    ).not.toBeVisible({
      timeout: 20_000,
    });

    /**
     * ==============================================
     * VERIFY RELEASED STATUS
     * ==============================================
     */

    const releasedOrderRow = getOrderRow(page);

    await expect(
      releasedOrderRow.locator(".status-track-label .badge"),
    ).toHaveText(/released/i, {
      timeout: 20_000,
    });

    await expect(releasedOrderRow.locator(".badge-paid")).toHaveText(/paid/i, {
      timeout: 20_000,
    });

    /**
     * ==============================================
     * VERIFY SEARCH
     * ==============================================
     */

    const searchInput = page.getByPlaceholder(/search order number/i);

    await searchInput.fill(customer.name);

    await expect(getOrderRow(page)).toBeVisible();

    /**
     * ==============================================
     * VIEW ORDER DETAILS
     * ==============================================
     */

    /**
     * ==============================================
     * VIEW ORDER DETAILS
     * ==============================================
     */

    await getOrderRow(page)
      .getByRole("button", {
        name: /^view$/i,
      })
      .click();

    const orderModal = page.locator(".order-modal");

    await expect(
      orderModal.getByRole("heading", {
        name: /order details/i,
      }),
    ).toBeVisible({
      timeout: 10_000,
    });

    await expect(
      orderModal.getByText(customer.name, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(orderModal.getByText(/^released$/i)).toBeVisible();

    /*
     * The modal contains two Close buttons.
     * Choose one explicitly to avoid another
     * strict-mode violation.
     */
    await orderModal
      .getByRole("button", {
        name: /^close$/i,
      })
      .first()
      .click();

    await expect(orderModal).not.toBeVisible({
      timeout: 10_000,
    });
  });
});
