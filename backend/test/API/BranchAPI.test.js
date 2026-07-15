// backend/test/API/BranchAPI.test.js

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

describe("Branch API Integration Test", () => {
  /**
   * ==============================================
   * GET ALL BRANCHES
   * ==============================================
   */

  describe("GET /api/branches", () => {
    it("should allow admin to view all branches", async () => {
      const response = await request(app).get("/api/branches");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should handle branch retrieval failure response", async () => {
      const response = await request(app).get("/api/branches/invalid-route");

      expect([404, 400]).toContain(response.status);
    });
  });

  /**
   * ==============================================
   * GET BRANCH BY ID
   * ==============================================
   */

  describe("GET /api/branches/:id", () => {
    it("should allow admin to open branch details", async () => {
      const branch = await createBranch();

      const response = await request(app).get(`/api/branches/${branch.id}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(branch.id);
    });

    it("should reject non-existing branch id", async () => {
      const response = await request(app).get("/api/branches/999999");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid branch id format", async () => {
      const response = await request(app).get("/api/branches/abc");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * CREATE BRANCH
   * ==============================================
   */

  describe("POST /api/branches", () => {
    it("should allow admin to create a new branch", async () => {
      const response = await request(app)
        .post("/api/branches")
        .send({
          branch_name: `New Branch ${Date.now()}`,

          address: "Balayan",

          status: "active",
        });

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data.branch_name).toContain("New Branch");
    });

    it("should reject creating branch without branch name", async () => {
      const response = await request(app).post("/api/branches").send({
        address: "Batangas",

        status: "active",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject duplicate branch name", async () => {
      const branch = await createBranch();

      const response = await request(app).post("/api/branches").send({
        branch_name: branch.branch_name,

        address: "Duplicate",

        status: "active",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid branch status", async () => {
      const response = await request(app)
        .post("/api/branches")
        .send({
          branch_name: `Invalid ${Date.now()}`,

          address: "Batangas",

          status: "wrong",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * UPDATE BRANCH
   * ==============================================
   */

  describe("PUT /api/branches/:id", () => {
    it("should allow admin to update branch information", async () => {
      const branch = await createBranch();

      const response = await request(app)
        .put(`/api/branches/${branch.id}`)
        .send({
          branch_name: `Updated ${Date.now()}`,
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject updating non-existing branch", async () => {
      const response = await request(app).put("/api/branches/999999").send({
        branch_name: "Updated Branch",
      });

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * DELETE BRANCH
   * ==============================================
   */

  describe("DELETE /api/branches/:id", () => {
    it("should allow admin to delete branch", async () => {
      const branch = await createBranch();

      const response = await request(app).delete(`/api/branches/${branch.id}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject deleting unknown branch", async () => {
      const response = await request(app).delete("/api/branches/999999");

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });
  });
});
