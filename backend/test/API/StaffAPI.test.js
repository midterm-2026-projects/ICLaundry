// backend/test/API/StaffAPI.test.js

import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

/**
 * ==============================================
 * TEST HELPERS
 * ==============================================
 */

const createBranch = async () => {
  const response = await request(app)
    .post("/api/branches")
    .send({
      branch_name: `Test Branch ${Date.now()}`,

      address: "Batangas",

      status: "active",
    });

  expect(response.status).toBe(201);

  return response.body.data;
};

const createStaff = async () => {
  const branch = await createBranch();

  const response = await request(app)
    .post("/api/staff")
    .send({
      full_name: `Test Staff ${Date.now()}`,

      email: `staff${Date.now()}@gmail.com`,

      phone: "09171234567",

      role: "staff",

      position: "Cashier",

      branch_id: branch.id,
    });

  expect(response.status).toBe(201);

  return response.body.data;
};

describe("Staff API Integration Test", () => {
  /**
   * ==============================================
   * GET ALL STAFF
   * ==============================================
   */

  describe("GET /api/staff", () => {
    it("should allow admin to view all staff members", async () => {
      const response = await request(app).get("/api/staff");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should reject invalid staff endpoint", async () => {
      const response = await request(app).get("/api/staff-invalid");

      expect(response.status).toBe(404);
    });
  });

  /**
   * ==============================================
   * GET STAFF BY ID
   * ==============================================
   */

  describe("GET /api/staff/:id", () => {
    it("should allow admin to open staff profile", async () => {
      const staff = await createStaff();

      const response = await request(app).get(`/api/staff/${staff.id}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(staff.id);

      expect(response.body.data.email).toBe(staff.email);
    });

    it("should reject unknown staff id", async () => {
      const response = await request(app).get("/api/staff/999999");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid staff id format", async () => {
      const response = await request(app).get("/api/staff/abc");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * FILTER STAFF BY ROLE
   * ==============================================
   */

  describe("GET /api/staff/role/:role", () => {
    it("should allow admin to filter staff by role", async () => {
      const response = await request(app).get("/api/staff/role/staff");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should reject invalid staff role", async () => {
      const response = await request(app).get("/api/staff/role/invalid-role");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * FILTER STAFF BY BRANCH
   * ==============================================
   */

  describe("GET /api/staff/branch/:branchId", () => {
    it("should allow admin to view staff assigned to branch", async () => {
      const branch = await createBranch();

      const response = await request(app).get(`/api/staff/branch/${branch.id}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should reject staff lookup using unknown branch", async () => {
      const response = await request(app).get("/api/staff/branch/999999");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * CREATE STAFF
   * ==============================================
   */

  describe("POST /api/staff", () => {
    it("should allow admin to create a staff account", async () => {
      const branch = await createBranch();

      const payload = {
        full_name: "Laundry Staff User",

        email: `laundry${Date.now()}@gmail.com`,

        phone: "09171234567",

        role: "staff",

        position: "Cashier",

        branch_id: branch.id,
      };

      const response = await request(app).post("/api/staff").send(payload);

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data.full_name).toBe(payload.full_name);

      expect(response.body.data.role).toBe("staff");
    });

    it("should reject creating staff without required fields", async () => {
      const response = await request(app).post("/api/staff").send({
        full_name: "",

        email: "",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject duplicate staff email", async () => {
      const staff = await createStaff();

      const branch = await createBranch();

      const response = await request(app).post("/api/staff").send({
        full_name: "Duplicate Staff",

        email: staff.email,

        phone: "09999999999",

        role: "staff",

        position: "Cashier",

        branch_id: branch.id,
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject staff with invalid role", async () => {
      const branch = await createBranch();

      const response = await request(app)
        .post("/api/staff")
        .send({
          full_name: "Invalid Role Staff",

          email: `invalid${Date.now()}@gmail.com`,

          phone: "09171234567",

          role: "manager",

          position: "Cashier",

          branch_id: branch.id,
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });
});
