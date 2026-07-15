// backend/test/unit/StaffService.test.js

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as staffModel from "../../models/StaffModel.js";
import * as branchModel from "../../models/BranchModel.js";

import {
  readStaff,
  readStaffById,
  addStaff,
  editStaff,
  removeStaff,
  readStaffByRole,
  readStaffByBranch,
} from "../../services/StaffService.js";

vi.mock("../../models/StaffModel.js", () => ({
  getStaff: vi.fn(),

  getStaffById: vi.fn(),

  getStaffByEmail: vi.fn(),

  createStaff: vi.fn(),

  updateStaff: vi.fn(),

  deleteStaff: vi.fn(),

  getStaffByRole: vi.fn(),

  getStaffByBranch: vi.fn(),
}));

vi.mock("../../models/BranchModel.js", () => ({
  getBranchById: vi.fn(),
}));

describe("Staff Service Unit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ==============================================
   * READ STAFF
   * ==============================================
   */

  describe("Read Staff", () => {
    it("should allow admin to retrieve all staff", async () => {
      const staff = [
        {
          id: "1",

          full_name: "Juan Dela Cruz",
        },
      ];

      staffModel.getStaff.mockResolvedValue(staff);

      const result = await readStaff();

      expect(result).toEqual(staff);

      expect(staffModel.getStaff).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * ==============================================
   * READ STAFF BY ID
   * ==============================================
   */

  describe("Read Staff By ID", () => {
    it("should allow admin to view staff profile", async () => {
      staffModel.getStaffById.mockResolvedValue({
        id: "1",

        full_name: "Juan",
      });

      const result = await readStaffById("1");

      expect(result.id).toBe("1");

      expect(staffModel.getStaffById).toHaveBeenCalledWith("1");
    });

    it("should reject missing staff id", async () => {
      await expect(readStaffById()).rejects.toThrow("Staff ID is required");
    });

    it("should reject unknown staff", async () => {
      staffModel.getStaffById.mockResolvedValue(null);

      await expect(readStaffById("999")).rejects.toThrow("Staff not found");
    });
  });

  /**
   * ==============================================
   * CREATE STAFF
   * ==============================================
   */

  describe("Create Staff", () => {
    it("should allow admin to create staff account", async () => {
      const payload = {
        full_name: "Juan Dela Cruz",

        email: "juan@gmail.com",

        role: "staff",

        branch_id: "branch-1",
      };

      staffModel.getStaffByEmail.mockResolvedValue(null);

      branchModel.getBranchById.mockResolvedValue({
        id: "branch-1",
      });

      staffModel.createStaff.mockResolvedValue(payload);

      const result = await addStaff(payload);

      expect(result.full_name).toBe("Juan Dela Cruz");

      expect(staffModel.createStaff).toHaveBeenCalled();
    });

    it("should prevent duplicate staff email", async () => {
      staffModel.getStaffByEmail.mockResolvedValue({
        id: "1",
      });

      await expect(
        addStaff({
          full_name: "Juan",

          email: "juan@gmail.com",

          role: "staff",
        }),
      ).rejects.toThrow("Email already exists");
    });

    it("should reject invalid email", async () => {
      await expect(
        addStaff({
          full_name: "Juan",

          email: "invalid-email",

          role: "staff",
        }),
      ).rejects.toThrow("Invalid email address");
    });

    it("should reject missing full name", async () => {
      await expect(
        addStaff({
          full_name: "",

          email: "juan@gmail.com",

          role: "staff",
        }),
      ).rejects.toThrow("Full name is required");
    });

    it("should reject invalid staff role", async () => {
      await expect(
        addStaff({
          full_name: "Juan",

          email: "juan@gmail.com",

          role: "manager",
        }),
      ).rejects.toThrow("Role must be one of: admin, staff");
    });

    it("should reject assigning staff to missing branch", async () => {
      staffModel.getStaffByEmail.mockResolvedValue(null);

      branchModel.getBranchById.mockResolvedValue(null);

      await expect(
        addStaff({
          full_name: "Juan",

          email: "juan@gmail.com",

          role: "staff",

          branch_id: "missing",
        }),
      ).rejects.toThrow("Branch not found");
    });
  });

  /**
   * ==============================================
   * UPDATE STAFF
   * ==============================================
   */

  describe("Update Staff", () => {
    it("should allow admin to update staff information", async () => {
      staffModel.getStaffById.mockResolvedValue({
        id: "1",
      });

      staffModel.getStaffByEmail.mockResolvedValue(null);

      staffModel.updateStaff.mockResolvedValue({
        id: "1",

        position: "Supervisor",
      });

      const result = await editStaff(
        "1",

        {
          position: "Supervisor",
        },
      );

      expect(result.position).toBe("Supervisor");

      expect(staffModel.updateStaff).toHaveBeenCalled();
    });

    it("should reject empty update data", async () => {
      await expect(editStaff("1", {})).rejects.toThrow(
        "Update data is required",
      );
    });

    it("should reject updating unknown staff", async () => {
      staffModel.getStaffById.mockResolvedValue(null);

      await expect(
        editStaff(
          "999",

          {
            position: "Manager",
          },
        ),
      ).rejects.toThrow("Staff not found");
    });

    it("should allow transferring staff branch", async () => {
      staffModel.getStaffById.mockResolvedValue({
        id: "1",
      });

      branchModel.getBranchById.mockResolvedValue({
        id: "branch-2",
      });

      staffModel.updateStaff.mockResolvedValue({
        branch_id: "branch-2",
      });

      const result = await editStaff(
        "1",

        {
          branch_id: "branch-2",
        },
      );

      expect(result.branch_id).toBe("branch-2");
    });
  });

  /**
   * ==============================================
   * DELETE STAFF
   * ==============================================
   */

  describe("Delete Staff", () => {
    it("should allow admin to delete staff account", async () => {
      staffModel.getStaffById.mockResolvedValue({
        id: "1",
      });

      staffModel.deleteStaff.mockResolvedValue(true);

      const result = await removeStaff("1");

      expect(result).toBe("Staff deleted successfully");

      expect(staffModel.deleteStaff).toHaveBeenCalledWith("1");
    });

    it("should reject deleting unknown staff", async () => {
      staffModel.getStaffById.mockResolvedValue(null);

      await expect(removeStaff("999")).rejects.toThrow("Staff not found");
    });
  });

  /**
   * ==============================================
   * FILTER STAFF
   * ==============================================
   */

  describe("Filter Staff", () => {
    it("should allow admin to filter staff by role", async () => {
      const resultData = [
        {
          role: "staff",
        },
      ];

      staffModel.getStaffByRole.mockResolvedValue(resultData);

      const result = await readStaffByRole("staff");

      expect(result).toEqual(resultData);

      expect(staffModel.getStaffByRole).toHaveBeenCalledWith("staff");
    });

    it("should allow admin to filter staff by branch", async () => {
      branchModel.getBranchById.mockResolvedValue({
        id: "branch-1",
      });

      const resultData = [
        {
          branch_id: "branch-1",
        },
      ];

      staffModel.getStaffByBranch.mockResolvedValue(resultData);

      const result = await readStaffByBranch("branch-1");

      expect(result).toEqual(resultData);

      expect(staffModel.getStaffByBranch).toHaveBeenCalledWith("branch-1");
    });
  });
});
