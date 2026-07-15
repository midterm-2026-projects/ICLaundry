// backend/test/integration/StaffModel.test.js

import { describe, it, expect } from "vitest";

import {
  getStaff,
  getStaffById,
  getStaffByEmail,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByRole,
  getStaffByBranch,
} from "../../models/StaffModel.js";

import { createBranch, deleteBranch } from "../../models/BranchModel.js";

describe("Staff Model Integration Test", () => {
  const createTestBranch = async () => {
    return await createBranch({
      branch_name: `Test Branch ${Date.now()}`,

      address: "Test Address",

      status: "active",
    });
  };

  const createTestStaff = async (branchId) => {
    return await createStaff({
      full_name: `Test Staff ${Date.now()}`,

      email: `staff${Date.now()}@gmail.com`,

      phone: "09171234567",

      role: "staff",

      position: "Cashier",

      branch_id: branchId,
    });
  };

  /**
   * ==============================================
   * CREATE STAFF
   * ==============================================
   */

  describe("Create Staff", () => {
    it("should allow admin to create a staff record", async () => {
      let branch;
      let staff;

      try {
        branch = await createTestBranch();

        staff = await createTestStaff(branch.id);

        expect(staff).toBeDefined();

        expect(staff.full_name).toContain("Test Staff");

        expect(staff.branch_id).toBe(branch.id);
      } finally {
        if (staff?.id) {
          await deleteStaff(staff.id);
        }

        if (branch?.id) {
          await deleteBranch(branch.id);
        }
      }
    });

    it("should allow staff to be assigned to a branch", async () => {
      let branch;
      let staff;

      try {
        branch = await createTestBranch();

        staff = await createStaff({
          full_name: "Assigned Staff",

          email: `assigned${Date.now()}@gmail.com`,

          phone: "09999999999",

          role: "staff",

          position: "Laundry Attendant",

          branch_id: branch.id,
        });

        expect(staff.branch_id).toBe(branch.id);
      } finally {
        if (staff?.id) await deleteStaff(staff.id);

        if (branch?.id) await deleteBranch(branch.id);
      }
    });
  });

  /**
   * ==============================================
   * VIEW STAFF
   * ==============================================
   */

  describe("Get Staff", () => {
    it("should allow admin to view all staff", async () => {
      const result = await getStaff();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return staff information required by dashboard", async () => {
      const result = await getStaff();

      expect(result.length).toBeGreaterThan(0);

      const staff = result[0];

      expect(staff).toHaveProperty("id");

      expect(staff).toHaveProperty("full_name");

      expect(staff).toHaveProperty("role");

      expect(staff).toHaveProperty("branch_id");
    });
  });

  /**
   * ==============================================
   * SEARCH STAFF
   * ==============================================
   */

  describe("Find Staff", () => {
    it("should allow admin to open staff profile", async () => {
      const staffList = await getStaff();

      expect(staffList.length).toBeGreaterThan(0);

      const staff = staffList[0];

      const result = await getStaffById(staff.id);

      expect(result.id).toBe(staff.id);
    });

    it("should allow admin to search staff by email", async () => {
      const staffList = await getStaff();

      expect(staffList.length).toBeGreaterThan(0);

      const staff = staffList[0];

      const result = await getStaffByEmail(staff.email);

      expect(result.email).toBe(staff.email);
    });

    it("should return null for unknown staff email", async () => {
      const result = await getStaffByEmail("unknown@example.com");

      expect(result).toBeNull();
    });

    it("should return null for unknown staff id", async () => {
      const result = await getStaffById("00000000-0000-0000-0000-000000000000");

      expect(result).toBeNull();
    });
  });

  /**
   * ==============================================
   * UPDATE STAFF
   * ==============================================
   */

  describe("Update Staff", () => {
    it("should allow admin to update staff information", async () => {
      let branch;
      let staff;

      try {
        branch = await createTestBranch();

        staff = await createTestStaff(branch.id);

        const result = await updateStaff(staff.id, {
          position: "Supervisor",
        });

        expect(result.position).toBe("Supervisor");
      } finally {
        if (staff?.id) await deleteStaff(staff.id);

        if (branch?.id) await deleteBranch(branch.id);
      }
    });

    it("should allow admin to transfer staff branch", async () => {
      let branch1;
      let branch2;
      let staff;

      try {
        branch1 = await createTestBranch();

        branch2 = await createTestBranch();

        staff = await createTestStaff(branch1.id);

        const result = await updateStaff(staff.id, {
          branch_id: branch2.id,
        });

        expect(result.branch_id).toBe(branch2.id);
      } finally {
        if (staff?.id) await deleteStaff(staff.id);

        if (branch1?.id) await deleteBranch(branch1.id);

        if (branch2?.id) await deleteBranch(branch2.id);
      }
    });
  });

  /**
   * ==============================================
   * DELETE STAFF
   * ==============================================
   */

  describe("Delete Staff", () => {
    it("should allow admin to delete staff account", async () => {
      let branch;
      let staff;

      try {
        branch = await createTestBranch();

        staff = await createTestStaff(branch.id);

        const result = await deleteStaff(staff.id);

        expect(result).toBe(true);

        const deleted = await getStaffById(staff.id);

        expect(deleted).toBeNull();
      } finally {
        if (branch?.id) await deleteBranch(branch.id);
      }
    });
  });

  /**
   * ==============================================
   * FILTER STAFF
   * ==============================================
   */

  describe("Staff Filtering", () => {
    it("should allow admin to filter staff by role", async () => {
      const result = await getStaffByRole("staff");

      expect(Array.isArray(result)).toBe(true);

      result.forEach((staff) => {
        expect(staff.role).toBe("staff");
      });
    });

    it("should allow admin to view staff assigned to branch", async () => {
      let branch;

      try {
        branch = await createTestBranch();

        const result = await getStaffByBranch(branch.id);

        expect(Array.isArray(result)).toBe(true);
      } finally {
        if (branch?.id) await deleteBranch(branch.id);
      }
    });
  });
});
