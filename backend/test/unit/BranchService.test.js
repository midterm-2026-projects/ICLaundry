// backend/test/unit/BranchService.test.js

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as branchModel from "../../models/BranchModel.js";

import {
  readBranches,
  readBranch,
  addBranch,
  editBranch,
  removeBranch,
} from "../../services/BranchService.js";

vi.mock("../../models/BranchModel.js", () => ({
  getBranches: vi.fn(),

  getBranchById: vi.fn(),

  getBranchByName: vi.fn(),

  createBranch: vi.fn(),

  updateBranch: vi.fn(),

  deleteBranch: vi.fn(),
}));

describe("Branch Service Unit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ==============================================
   * READ BRANCHES
   * ==============================================
   */

  describe("Read Branches", () => {
    it("should allow admin to retrieve all branches", async () => {
      const branches = [
        {
          id: "1",

          branch_name: "Main Branch",
        },
      ];

      branchModel.getBranches.mockResolvedValue(branches);

      const result = await readBranches();

      expect(result).toEqual(branches);

      expect(branchModel.getBranches).toHaveBeenCalledTimes(1);
    });

    it("should throw error when branch retrieval fails", async () => {
      branchModel.getBranches.mockRejectedValue(new Error("Database error"));

      await expect(readBranches()).rejects.toThrow("Database error");
    });
  });

  /**
   * ==============================================
   * READ BRANCH
   * ==============================================
   */

  describe("Read Branch", () => {
    it("should allow admin to view branch details", async () => {
      branchModel.getBranchById.mockResolvedValue({
        id: "1",

        branch_name: "Main Branch",
      });

      const result = await readBranch("1");

      expect(result.id).toBe("1");

      expect(branchModel.getBranchById).toHaveBeenCalledWith("1");
    });

    it("should reject missing branch id", async () => {
      await expect(readBranch()).rejects.toThrow("Branch ID is required");
    });

    it("should reject unknown branch", async () => {
      branchModel.getBranchById.mockResolvedValue(null);

      await expect(readBranch("999")).rejects.toThrow("Branch not found");
    });
  });

  /**
   * ==============================================
   * CREATE BRANCH
   * ==============================================
   */

  describe("Create Branch", () => {
    it("should allow admin to create a branch", async () => {
      const payload = {
        branch_name: "Main Branch",

        address: "Batangas",

        status: "active",
      };

      branchModel.getBranchByName.mockResolvedValue(null);

      branchModel.createBranch.mockResolvedValue(payload);

      const result = await addBranch(payload);

      expect(result.branch_name).toBe("Main Branch");

      expect(branchModel.createBranch).toHaveBeenCalled();
    });

    it("should prevent duplicate branch creation", async () => {
      branchModel.getBranchByName.mockResolvedValue({
        id: "1",

        branch_name: "Main Branch",
      });

      await expect(
        addBranch({
          branch_name: "Main Branch",

          status: "active",
        }),
      ).rejects.toThrow("Branch already exists");
    });

    it("should reject missing branch name", async () => {
      await expect(
        addBranch({
          branch_name: "",
        }),
      ).rejects.toThrow("Branch name is required");
    });

    it("should reject invalid branch status", async () => {
      await expect(
        addBranch({
          branch_name: "Test Branch",

          status: "invalid",
        }),
      ).rejects.toThrow("Invalid branch status");
    });

    it("should handle database creation failure", async () => {
      branchModel.getBranchByName.mockResolvedValue(null);

      branchModel.createBranch.mockRejectedValue(new Error("Insert failed"));

      await expect(
        addBranch({
          branch_name: "New Branch",

          status: "active",
        }),
      ).rejects.toThrow("Insert failed");
    });
  });

  /**
   * ==============================================
   * UPDATE BRANCH
   * ==============================================
   */

  describe("Update Branch", () => {
    it("should allow admin to update branch", async () => {
      branchModel.getBranchById.mockResolvedValue({
        id: "1",
      });

      branchModel.getBranchByName.mockResolvedValue(null);

      branchModel.updateBranch.mockResolvedValue({
        id: "1",

        branch_name: "Updated Branch",
      });

      const result = await editBranch("1", {
        branch_name: "Updated Branch",
      });

      expect(result.branch_name).toBe("Updated Branch");
    });

    it("should reject updating missing branch", async () => {
      branchModel.getBranchById.mockResolvedValue(null);

      await expect(
        editBranch("999", {
          branch_name: "Updated",
        }),
      ).rejects.toThrow("Branch not found");
    });

    it("should reject empty update data", async () => {
      await expect(editBranch("1", {})).rejects.toThrow(
        "Update data is required",
      );
    });
  });

  /**
   * ==============================================
   * DELETE BRANCH
   * ==============================================
   */

  describe("Delete Branch", () => {
    it("should allow admin to delete branch", async () => {
      branchModel.getBranchById.mockResolvedValue({
        id: "1",
      });

      branchModel.deleteBranch.mockResolvedValue(true);

      const result = await removeBranch("1");

      expect(result).toBe("Branch deleted successfully");
    });

    it("should reject deleting unknown branch", async () => {
      branchModel.getBranchById.mockResolvedValue(null);

      await expect(removeBranch("999")).rejects.toThrow("Branch not found");
    });
  });
});
