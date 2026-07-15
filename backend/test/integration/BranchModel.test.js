// backend/test/integration/BranchModel.test.js

import { describe, it, expect } from "vitest";

import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../models/BranchModel.js";

describe("Branch Model Integration Test", () => {
  /**
   * ==============================================
   * CREATE BRANCH
   * ==============================================
   */

  describe("Create Branch", () => {
    it("should allow admin to create a new branch record", async () => {
      const branchData = {
        branch_name: `Test Branch ${Date.now()}`,

        address: "Test Address",

        status: "active",
      };

      const result = await createBranch(branchData);

      expect(result).toBeDefined();

      expect(result.branch_name).toBe(branchData.branch_name);

      expect(result.address).toBe(branchData.address);

      expect(result.status).toBe("active");

      await deleteBranch(result.id);
    });

    it("should create multiple branches independently", async () => {
      const branch1 = await createBranch({
        branch_name: `Branch One ${Date.now()}`,

        address: "Address One",

        status: "active",
      });

      const branch2 = await createBranch({
        branch_name: `Branch Two ${Date.now()}`,

        address: "Address Two",

        status: "active",
      });

      expect(branch1.id).not.toBe(branch2.id);

      await deleteBranch(branch1.id);

      await deleteBranch(branch2.id);
    });
  });

  /**
   * ==============================================
   * VIEW BRANCHES
   * ==============================================
   */

  describe("Get Branches", () => {
    it("should allow admin to view all branches", async () => {
      const result = await getBranches();

      expect(Array.isArray(result)).toBe(true);

      expect(result).toHaveLength(result.length);
    });

    it("should return branch information needed by dashboard", async () => {
      const branches = await getBranches();

      expect(branches.length).toBeGreaterThan(0);

      const branch = branches[0];

      expect(branch).toHaveProperty("id");

      expect(branch).toHaveProperty("branch_name");

      expect(branch).toHaveProperty("status");
    });
  });

  /**
   * ==============================================
   * FIND BRANCH
   * ==============================================
   */

  describe("Get Branch By ID", () => {
    it("should allow admin to open branch details", async () => {
      const createdBranch = await createBranch({
        branch_name: `Lookup Branch ${Date.now()}`,

        address: "Lookup Address",

        status: "active",
      });

      const result = await getBranchById(createdBranch.id);

      expect(result).toBeDefined();

      expect(result.id).toBe(createdBranch.id);

      expect(result.branch_name).toBe(createdBranch.branch_name);

      await deleteBranch(createdBranch.id);
    });

    it("should return null when branch does not exist", async () => {
      const result = await getBranchById(
        "00000000-0000-0000-0000-000000000000",
      );

      expect(result).toBeNull();
    });
  });

  /**
   * ==============================================
   * UPDATE BRANCH
   * ==============================================
   */

  describe("Update Branch", () => {
    it("should allow admin to update branch information", async () => {
      const branch = await createBranch({
        branch_name: `Old Branch ${Date.now()}`,

        address: "Old Address",

        status: "active",
      });

      const result = await updateBranch(branch.id, {
        branch_name: "Updated Branch",

        address: "Updated Address",
      });

      expect(result.branch_name).toBe("Updated Branch");

      expect(result.address).toBe("Updated Address");

      await deleteBranch(branch.id);
    });

    it("should allow admin to deactivate a branch", async () => {
      const branch = await createBranch({
        branch_name: `Deactivate ${Date.now()}`,

        address: "Address",

        status: "active",
      });

      const result = await updateBranch(branch.id, {
        status: "inactive",
      });

      expect(result.status).toBe("inactive");

      await deleteBranch(branch.id);
    });
  });

  /**
   * ==============================================
   * DELETE BRANCH
   * ==============================================
   */

  describe("Delete Branch", () => {
    it("should allow admin to remove a branch", async () => {
      const branch = await createBranch({
        branch_name: `Delete Branch ${Date.now()}`,

        address: "Delete Address",

        status: "active",
      });

      const result = await deleteBranch(branch.id);

      expect(result).toBe(true);
    });

    it("should not retrieve branch after deletion", async () => {
      const branch = await createBranch({
        branch_name: `Removed Branch ${Date.now()}`,

        address: "Delete Address",

        status: "active",
      });

      await deleteBranch(branch.id);

      const result = await getBranchById(branch.id);

      expect(result).toBeNull();
    });
  });
});
