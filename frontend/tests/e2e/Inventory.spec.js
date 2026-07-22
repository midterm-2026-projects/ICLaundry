import { expect, test } from "@playwright/test";

const inventoryPath = /\/api\/inventory(?:\/.*)?\/?(?:\?.*)?$/i;

const attachDiagnostics = (page) => {
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
};

const performInventoryAction = async ({
  page,
  action,
  method,
  description,
  path = inventoryPath,
}) => {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === method && path.test(response.url()),
    { timeout: 30_000 },
  );

  await action();

  const response = await responsePromise;
  const responseBody = await response.text().catch(() => "");

  expect(
    response.ok(),
    `${description} failed (${response.status()}): ${responseBody}`,
  ).toBeTruthy();

  return response;
};

const fillInventoryForm = async (page, item) => {
  const settleReactUpdate = () =>
    page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );

  const setValue = async (label, value, options) => {
    const field = page.getByLabel(label, options);

    if ((await field.evaluate((element) => element.tagName)) === "SELECT") {
      await field.selectOption(value);
    } else {
      await field.fill(String(value));
    }

    await settleReactUpdate();
  };

  await setValue("Item Name", item.name);
  await setValue("Category", item.category);
  await setValue("Branch", item.branch, { exact: true });
  await setValue("Current Stock", item.quantity);
  await setValue("Unit", item.unit, { exact: true });
  await setValue("Minimum Stock", item.minimumStock);
  await setValue("Cost Per Unit", item.costPerUnit);
  await setValue("Usage Per Load", item.usagePerLoad);

  await expect(page.getByLabel("Item Name")).toHaveValue(item.name);
  await expect(page.getByLabel("Category")).toHaveValue(item.category);
  await expect(page.getByLabel("Branch", { exact: true })).toHaveValue(
    item.branch,
  );
  await expect(page.getByLabel("Usage Per Load")).toHaveValue(
    String(item.usagePerLoad),
  );
};

test.describe("Inventory Management Workflow", () => {
  test("validates item entry, closes with Escape, and clears filters", async ({ page }) => {
    await page.route("**/api/inventory/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
    await page.route("**/api/inventory", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
    await page.goto("/inventory");
    await expect(page.getByText("No inventory items found")).toBeVisible();

    await page.getByRole("button", { name: "Add Inventory Item" }).click();
    await page.getByRole("button", { name: "Save Item" }).click();
    await expect(page.getByRole("alert")).toContainText("Item name is required");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Add Inventory Item" })).toBeHidden();

    await page.getByLabel("Search inventory").fill("detergent");
    await page.getByLabel("Filter inventory by branch").selectOption("Calzada");
    await expect(page.getByRole("button", { name: "Clear Filters" })).toBeEnabled();
    await page.getByRole("button", { name: "Clear Filters" }).click();
    await expect(page.getByLabel("Search inventory")).toHaveValue("");
    await expect(page.getByLabel("Filter inventory by branch")).toHaveValue("All Branches");
  });

  test("adds, filters, edits, restocks, and deletes an inventory item", async ({
    page,
  }) => {
    attachDiagnostics(page);

    const timestamp = Date.now();
    const item = {
      name: `Playwright Detergent ${timestamp}`,
      category: "Detergent",
      branch: "Main - Brgy 7",
      quantity: 20,
      unit: "L",
      minimumStock: 5,
      costPerUnit: 125.5,
      usagePerLoad: 0.25,
    };
    const updatedName = `${item.name} Updated`;

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /^inventory$/i }).click();

    await expect(page).toHaveURL(/\/inventory$/);
    await expect(
      page.getByRole("heading", { name: "Inventory", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Loading inventory...")).toBeHidden();

    await page.getByRole("button", { name: "Add Inventory Item" }).click();
    await expect(
      page.getByRole("heading", { name: "Add Inventory Item" }),
    ).toBeVisible();
    await fillInventoryForm(page, item);

    await performInventoryAction({
      page,
      method: "POST",
      description: "Create inventory item",
      path: /\/api\/inventory\/?$/i,
      action: () => page.getByRole("button", { name: "Save Item" }).click(),
    });

    await expect(page.getByRole("status")).toContainText(
      `${item.name} was added successfully.`,
    );

    const search = page.getByLabel("Search inventory");
    await search.fill(item.name);

    const createdRow = page.locator("tbody tr").filter({ hasText: item.name });
    await expect(createdRow).toHaveCount(1);
    await expect(createdRow).toContainText(item.branch);
    await expect(createdRow).toContainText("20 L");

    await performInventoryAction({
      page,
      method: "GET",
      description: "Filter inventory by branch",
      path: /\/api\/inventory\/branch\/Main%20-%20Brgy%207\/?$/i,
      action: () =>
        page
          .getByLabel("Filter inventory by branch")
          .selectOption(item.branch),
    });
    await expect(createdRow).toHaveCount(1);

    await createdRow
      .getByRole("button", { name: `Edit ${item.name}` })
      .click();
    await expect(
      page.getByRole("heading", { name: "Edit Inventory Item" }),
    ).toBeVisible();
    await page.getByLabel("Item Name").fill(updatedName);
    await page.getByLabel("Cost Per Unit").fill("130");

    await performInventoryAction({
      page,
      method: "PUT",
      description: "Update inventory item",
      action: () => page.getByRole("button", { name: "Update Item" }).click(),
    });

    await expect(page.getByRole("status")).toContainText(
      `${updatedName} was updated successfully.`,
    );
    await search.fill(updatedName);

    const updatedRow = page.locator("tbody tr").filter({ hasText: updatedName });
    await expect(updatedRow).toHaveCount(1);
    await expect(updatedRow).toContainText("₱130.00");

    await updatedRow
      .getByRole("button", { name: `Restock ${updatedName}` })
      .click();
    await page.getByLabel("Restock Quantity").fill("10");
    await page
      .getByLabel("Restock Notes")
      .fill(`Playwright restock ${timestamp}`);
    await expect(page.getByText("30 L", { exact: true })).toBeVisible();

    await performInventoryAction({
      page,
      method: "POST",
      description: "Restock inventory item",
      path: /\/api\/inventory\/restocks\/?$/i,
      action: () =>
        page.getByRole("button", { name: "Submit Restock" }).click(),
    });

    await expect(page.getByRole("status")).toContainText(
      `${updatedName} was restocked successfully.`,
    );
    await expect(updatedRow).toContainText("30 L");

    page.once("dialog", (dialog) => dialog.accept());
    await performInventoryAction({
      page,
      method: "DELETE",
      description: "Delete inventory item",
      action: () =>
        updatedRow
          .getByRole("button", { name: `Delete ${updatedName}` })
          .click(),
    });

    await expect(page.getByRole("status")).toContainText(
      `${updatedName} was deleted successfully.`,
    );
    await expect(updatedRow).toHaveCount(0);
  });
});
