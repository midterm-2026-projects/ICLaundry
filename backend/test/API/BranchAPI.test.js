import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Branch API Integration Test", () => {
  describe("GET /api/branches", () => {
    it("should return all branches", async () => {
      // Act
      const response = await request(app).get("/api/branches");

      // Assert
      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/branches/:id", () => {
    it("should return an existing branch", async () => {
      // Arrange
      const branchesResponse = await request(app).get("/api/branches");

      expect(branchesResponse.status).toBe(200);

      expect(branchesResponse.body.data.length).toBeGreaterThan(0);

      const branch = branchesResponse.body.data[0];

      // Act
      const response = await request(app).get(`/api/branches/${branch.id}`);

      // Assert
      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(branch.id);
    });
  });

  describe("POST /api/branches", () => {
    it("should create a branch", async () => {
      // Arrange
      const payload = {
        branch_name: `API Branch ${Date.now()}`,
        address: "Batangas",
        status: "active",
      };

      // Act
      const response = await request(app).post("/api/branches").send(payload);

      // Assert
      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data.branch_name).toBe(payload.branch_name);
    });
  });
});
