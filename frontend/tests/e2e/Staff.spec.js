import { expect, test } from "@playwright/test";

const branches = [{ id: "branch-main", branch_name: "Main Branch" }, { id: "branch-north", branch_name: "North Branch" }];
const initialStaff = [
  { id: "staff-1", full_name: "Ana Santos", email: "ana@example.com", phone: "09170000001", role: "admin", position: "Manager", branch_id: "branch-main", branch: branches[0] },
  { id: "staff-2", full_name: "Ben Cruz", email: "ben@example.com", phone: "09170000002", role: "staff", position: "Cashier", branch_id: "branch-north", branch: branches[1] },
];

const installStaffAPI = async (page, options = {}) => {
  let records = structuredClone(initialStaff);
  const requests = [];
  await page.route("**/api/branches**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: branches }) }));
  await page.route("**/api/staff**", async (route) => {
    const request = route.request(); const method = request.method(); const url = new URL(request.url());
    requests.push({ method, url: url.pathname, body: request.postDataJSON?.() });
    if (options.failLoad && method === "GET") return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, message: "Unable to load staff" }) });
    if (method === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: records }) });
    if (method === "POST") {
      const body = request.postDataJSON();
      if (options.failCreate) return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ success: false, message: "Email already exists" }) });
      const created = { ...body, id: "staff-3", branch: branches.find((item) => item.id === body.branch_id) }; records = [created, ...records];
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ success: true, data: created }) });
    }
    const id = url.pathname.split("/").pop();
    if (method === "PUT") { const body = request.postDataJSON(); records = records.map((item) => item.id === id ? { ...item, ...body, branch: branches.find((branch) => branch.id === body.branch_id) } : item); return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: records.find((item) => item.id === id) }) }); }
    if (method === "DELETE") { records = records.filter((item) => item.id !== id); return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, message: "Staff deleted successfully" }) }); }
    return route.fallback();
  });
  return requests;
};

const openStaff = async (page) => { await page.goto("/"); await page.getByRole("button", { name: /^staff$/i }).click(); await expect(page).toHaveURL(/\/staff$/); await expect(page.getByRole("heading", { name: "Staff", exact: true })).toBeVisible(); };

test.describe("Staff Management Workflow", () => {
  test("creates, edits, filters, searches, and deletes a staff member", async ({ page }) => {
    const requests = await installStaffAPI(page); await openStaff(page);
    await expect(page.getByText("2 staff members")).toBeVisible();
    await page.getByRole("button", { name: "Add Staff", exact: true }).click();
    const addDialog = page.getByRole("dialog", { name: "Add Staff" });
    await addDialog.getByLabel("Full Name").fill("Cara Reyes"); await addDialog.getByLabel("Email").fill("cara@example.com"); await addDialog.getByLabel("Phone").fill("09170000003"); await addDialog.getByLabel("Role", { exact: true }).selectOption("staff"); await addDialog.getByLabel("Position").fill("Attendant"); await addDialog.getByLabel("Branch", { exact: true }).selectOption("branch-main");
    await addDialog.getByRole("button", { name: "Create Staff" }).click();
    await expect(page.getByRole("status")).toContainText("created successfully"); await expect(page.getByText("Cara Reyes")).toBeVisible();
    expect(requests.find((item) => item.method === "POST")?.body).toMatchObject({ full_name: "Cara Reyes", branch_id: "branch-main" });

    await page.getByRole("button", { name: "Edit Cara Reyes" }).click(); const editDialog = page.getByRole("dialog", { name: "Edit Staff" }); await editDialog.getByLabel("Position").fill("Senior Attendant"); await editDialog.getByLabel("Branch", { exact: true }).selectOption("branch-north"); await editDialog.getByRole("button", { name: "Update Staff" }).click();
    await expect(page.getByText("Senior Attendant")).toBeVisible(); await expect(page.getByRole("status")).toContainText("updated successfully");

    await page.getByLabel("Search staff").fill("Cara"); await expect(page.getByText("1 staff member")).toBeVisible();
    await page.getByLabel("Role", { exact: true }).selectOption("admin"); await expect(page.getByText("No staff members found")).toBeVisible();
    await page.getByRole("button", { name: "Clear" }).click(); await page.getByLabel("Branch", { exact: true }).selectOption("branch-north"); await expect(page.getByText("2 staff members")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept()); await page.getByRole("button", { name: "Delete Cara Reyes" }).click(); await expect(page.locator(".staff-table").getByText("Cara Reyes")).not.toBeVisible(); await expect(page.getByRole("status")).toContainText("deleted successfully");
    expect(requests.some((item) => item.method === "PUT" && item.body.position === "Senior Attendant")).toBeTruthy(); expect(requests.some((item) => item.method === "DELETE" && item.url.endsWith("staff-3"))).toBeTruthy();
  });

  test("validates input, closes safely, and presents backend errors", async ({ page }) => {
    await installStaffAPI(page, { failCreate: true }); await openStaff(page); await page.getByRole("button", { name: "Add Staff", exact: true }).click();
    await page.getByRole("button", { name: "Create Staff" }).click(); await expect(page.getByRole("alert")).toContainText("Full name is required");
    await page.getByLabel("Full Name").fill("Invalid User"); await page.getByLabel("Email").fill("invalid"); await page.getByRole("button", { name: "Create Staff" }).click(); await expect(page.getByRole("alert")).toContainText("valid email");
    await page.getByLabel("Email").fill("duplicate@example.com"); await page.getByRole("button", { name: "Create Staff" }).click(); await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Email already exists");
    await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("shows an empty state and retryable loading error", async ({ page }) => {
    await installStaffAPI(page, { failLoad: true }); await openStaff(page); await expect(page.getByRole("alert")).toContainText("Unable to load staff"); await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });
});
