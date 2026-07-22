# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Staff.spec.js >> Staff Management Workflow >> creates, edits, filters, searches, and deletes a staff member
- Location: tests\e2e\Staff.spec.js:35:3

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByText('Cara Reyes')
Expected: not visible
Received: visible
Timeout:  30000ms

Call log:
  - Expect "not toBeVisible" with timeout 30000ms
  - waiting for getByText('Cara Reyes')
    62 × locator resolved to <div role="status" class="staff-message">…</div>
       - unexpected value "visible"

```

```yaml
- status:
  - text: Cara Reyes was deleted successfully.
  - button "Close success message": ×
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const branches = [{ id: "branch-main", branch_name: "Main Branch" }, { id: "branch-north", branch_name: "North Branch" }];
  4  | const initialStaff = [
  5  |   { id: "staff-1", full_name: "Ana Santos", email: "ana@example.com", phone: "09170000001", role: "admin", position: "Manager", branch_id: "branch-main", branch: branches[0] },
  6  |   { id: "staff-2", full_name: "Ben Cruz", email: "ben@example.com", phone: "09170000002", role: "staff", position: "Cashier", branch_id: "branch-north", branch: branches[1] },
  7  | ];
  8  | 
  9  | const installStaffAPI = async (page, options = {}) => {
  10 |   let records = structuredClone(initialStaff);
  11 |   const requests = [];
  12 |   await page.route("**/api/branches**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: branches }) }));
  13 |   await page.route("**/api/staff**", async (route) => {
  14 |     const request = route.request(); const method = request.method(); const url = new URL(request.url());
  15 |     requests.push({ method, url: url.pathname, body: request.postDataJSON?.() });
  16 |     if (options.failLoad && method === "GET") return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, message: "Unable to load staff" }) });
  17 |     if (method === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: records }) });
  18 |     if (method === "POST") {
  19 |       const body = request.postDataJSON();
  20 |       if (options.failCreate) return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ success: false, message: "Email already exists" }) });
  21 |       const created = { ...body, id: "staff-3", branch: branches.find((item) => item.id === body.branch_id) }; records = [created, ...records];
  22 |       return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ success: true, data: created }) });
  23 |     }
  24 |     const id = url.pathname.split("/").pop();
  25 |     if (method === "PUT") { const body = request.postDataJSON(); records = records.map((item) => item.id === id ? { ...item, ...body, branch: branches.find((branch) => branch.id === body.branch_id) } : item); return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: records.find((item) => item.id === id) }) }); }
  26 |     if (method === "DELETE") { records = records.filter((item) => item.id !== id); return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, message: "Staff deleted successfully" }) }); }
  27 |     return route.fallback();
  28 |   });
  29 |   return requests;
  30 | };
  31 | 
  32 | const openStaff = async (page) => { await page.goto("/"); await page.getByRole("button", { name: /^staff$/i }).click(); await expect(page).toHaveURL(/\/staff$/); await expect(page.getByRole("heading", { name: "Staff", exact: true })).toBeVisible(); };
  33 | 
  34 | test.describe("Staff Management Workflow", () => {
  35 |   test("creates, edits, filters, searches, and deletes a staff member", async ({ page }) => {
  36 |     const requests = await installStaffAPI(page); await openStaff(page);
  37 |     await expect(page.getByText("2 staff members")).toBeVisible();
  38 |     await page.getByRole("button", { name: "Add Staff", exact: true }).click();
  39 |     const addDialog = page.getByRole("dialog", { name: "Add Staff" });
  40 |     await addDialog.getByLabel("Full Name").fill("Cara Reyes"); await addDialog.getByLabel("Email").fill("cara@example.com"); await addDialog.getByLabel("Phone").fill("09170000003"); await addDialog.getByLabel("Role", { exact: true }).selectOption("staff"); await addDialog.getByLabel("Position").fill("Attendant"); await addDialog.getByLabel("Branch", { exact: true }).selectOption("branch-main");
  41 |     await addDialog.getByRole("button", { name: "Create Staff" }).click();
  42 |     await expect(page.getByRole("status")).toContainText("created successfully"); await expect(page.getByText("Cara Reyes")).toBeVisible();
  43 |     expect(requests.find((item) => item.method === "POST")?.body).toMatchObject({ full_name: "Cara Reyes", branch_id: "branch-main" });
  44 | 
  45 |     await page.getByRole("button", { name: "Edit Cara Reyes" }).click(); const editDialog = page.getByRole("dialog", { name: "Edit Staff" }); await editDialog.getByLabel("Position").fill("Senior Attendant"); await editDialog.getByLabel("Branch", { exact: true }).selectOption("branch-north"); await editDialog.getByRole("button", { name: "Update Staff" }).click();
  46 |     await expect(page.getByText("Senior Attendant")).toBeVisible(); await expect(page.getByRole("status")).toContainText("updated successfully");
  47 | 
  48 |     await page.getByLabel("Search staff").fill("Cara"); await expect(page.getByText("1 staff member")).toBeVisible();
  49 |     await page.getByLabel("Role", { exact: true }).selectOption("admin"); await expect(page.getByText("No staff members found")).toBeVisible();
  50 |     await page.getByRole("button", { name: "Clear" }).click(); await page.getByLabel("Branch", { exact: true }).selectOption("branch-north"); await expect(page.getByText("2 staff members")).toBeVisible();
  51 | 
> 52 |     page.once("dialog", (dialog) => dialog.accept()); await page.getByRole("button", { name: "Delete Cara Reyes" }).click(); await expect(page.getByText("Cara Reyes")).not.toBeVisible(); await expect(page.getByRole("status")).toContainText("deleted successfully");
     |                                                                                                                                                                             ^ Error: expect(locator).not.toBeVisible() failed
  53 |     expect(requests.some((item) => item.method === "PUT" && item.body.position === "Senior Attendant")).toBeTruthy(); expect(requests.some((item) => item.method === "DELETE" && item.url.endsWith("staff-3"))).toBeTruthy();
  54 |   });
  55 | 
  56 |   test("validates input, closes safely, and presents backend errors", async ({ page }) => {
  57 |     await installStaffAPI(page, { failCreate: true }); await openStaff(page); await page.getByRole("button", { name: "Add Staff", exact: true }).click();
  58 |     await page.getByRole("button", { name: "Create Staff" }).click(); await expect(page.getByRole("alert")).toContainText("Full name is required");
  59 |     await page.getByLabel("Full Name").fill("Invalid User"); await page.getByLabel("Email").fill("invalid"); await page.getByRole("button", { name: "Create Staff" }).click(); await expect(page.getByRole("alert")).toContainText("valid email");
  60 |     await page.getByLabel("Email").fill("duplicate@example.com"); await page.getByRole("button", { name: "Create Staff" }).click(); await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Email already exists");
  61 |     await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
  62 |   });
  63 | 
  64 |   test("shows an empty state and retryable loading error", async ({ page }) => {
  65 |     await installStaffAPI(page, { failLoad: true }); await openStaff(page); await expect(page.getByRole("alert")).toContainText("Unable to load staff"); await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  66 |   });
  67 | });
  68 | 
```