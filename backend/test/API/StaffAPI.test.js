import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Staff API Integration Test", () => {
  describe("GET /api/staff", () => {
    it("should return all staff", async () => {
      // Act
      const response = await request(app).get("/api/staff");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/staff/:id", () => {
    it("should return an existing staff member", async () => {
      // ==============================================
      // Arrange
      // ==============================================

      const branchResponse = await request(app)
        .post("/api/branches")
        .send({
          branch_name: `Lookup Branch ${Date.now()}`,
          address: "Batangas",
          status: "active",
        });

      expect(branchResponse.status).toBe(201);
      expect(branchResponse.body.success).toBe(true);

      const branch = branchResponse.body.data;

      const createResponse = await request(app)
        .post("/api/staff")
        .send({
          full_name: "Lookup Staff",
          email: `lookup${Date.now()}@gmail.com`,
          phone: "09171234567",
          role: "staff",
          position: "Cashier",
          branch_id: branch.id,
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);

      const createdStaff = createResponse.body.data;

      // ==============================================
      // Act
      // ==============================================

      const response = await request(app).get(`/api/staff/${createdStaff.id}`);

      // ==============================================
      // Assert
      // ==============================================

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdStaff.id);
      expect(response.body.data.email).toBe(createdStaff.email);
    });
  });

  describe("GET /api/staff/role/:role", () => {
    it("should return staff by role", async () => {
      const response = await request(app).get("/api/staff/role/staff");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/staff/branch/:branchId", () => {
    it("should return staff by branch", async () => {
      // Arrange
      const branchResponse = await request(app)
        .post("/api/branches")
        .send({
          branch_name: `Branch ${Date.now()}`,
          address: "Batangas",
          status: "active",
        });

      expect(branchResponse.status).toBe(201);

      const branch = branchResponse.body.data;

      // Act
      const response = await request(app).get(`/api/staff/branch/${branch.id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("POST /api/staff", () => {
    it("should create a staff member", async () => {
      // ==============================================
      // Arrange
      // ==============================================

      const branchResponse = await request(app)
        .post("/api/branches")
        .send({
          branch_name: `API Branch ${Date.now()}`,
          address: "Balayan",
          status: "active",
        });

      expect(branchResponse.status).toBe(201);
      expect(branchResponse.body.success).toBe(true);

      const branch = branchResponse.body.data;

      const payload = {
        full_name: "API Test User",
        email: `apitest${Date.now()}@gmail.com`,
        phone: "09171234567",
        role: "staff",
        position: "Cashier",
        branch_id: branch.id,
      };

      // ==============================================
      // Act
      // ==============================================

      const response = await request(app).post("/api/staff").send(payload);

      // ==============================================
      // Assert
      // ==============================================

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data.full_name).toBe(payload.full_name);
      expect(response.body.data.email).toBe(payload.email);
      expect(response.body.data.role).toBe(payload.role);
      expect(response.body.data.position).toBe(payload.position);
      expect(response.body.data.branch_id).toBe(branch.id);
    });
  });
});
