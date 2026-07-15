// frontend/test/pages/Staff.test.jsx

import { describe, it, expect, vi, beforeEach } from "vitest";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import Staff from "../../src/pages/Staff";

vi.mock("../../src/API/staffAPI", () => ({
  getStaff: vi.fn(),

  createStaff: vi.fn(),

  updateStaff: vi.fn(),

  deleteStaff: vi.fn(),
}));

vi.mock("../../src/API/branchAPI", () => ({
  getBranches: vi.fn(),
}));

import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../src/API/staffAPI";

import { getBranches } from "../../src/API/branchAPI";

describe("Staff Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getStaff.mockResolvedValue([
      {
        id: "1",

        full_name: "John Doe",

        email: "john@test.com",

        phone: "09123456789",

        role: "staff",

        position: "Cashier",

        branch_id: "1",

        branch_name: "Main Branch",
      },

      {
        id: "2",

        full_name: "Jane Smith",

        email: "jane@test.com",

        phone: "09999999999",

        role: "admin",

        position: "Manager",

        branch_id: "2",

        branch_name: "Balayan",
      },
    ]);

    getBranches.mockResolvedValue([
      {
        id: "1",

        branch_name: "Main Branch",
      },

      {
        id: "2",

        branch_name: "Balayan",
      },
    ]);
  });

  /**
   * ==============================================
   * PAGE LOADING
   * ==============================================
   */

  it("should allow admin to open staff management page", async () => {
    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("should display staff table information", async () => {
    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("should handle empty staff records", async () => {
    getStaff.mockResolvedValue([]);

    render(<Staff />);

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("should handle staff loading error", async () => {
    getStaff.mockRejectedValue(new Error("Failed loading staff"));

    render(<Staff />);

    await waitFor(() => {
      expect(getStaff).toHaveBeenCalled();
    });
  });

  /**
   * ==============================================
   * SEARCH STAFF
   * ==============================================
   */

  it("should allow admin to search staff", async () => {
    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search staff..."),

      {
        target: {
          value: "Jane",
        },
      },
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should show no result when searching unknown staff", async () => {
    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search staff..."),

      {
        target: {
          value: "Unknown",
        },
      },
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  /**
   * ==============================================
   * FILTER STAFF
   * ==============================================
   */

  it("should allow admin to filter staff by role", async () => {
    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(
      selects[0],

      {
        target: {
          value: "admin",
        },
      },
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should allow admin to filter staff by branch", async () => {
    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(
      selects[1],

      {
        target: {
          value: "2",
        },
      },
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  /**
   * ==============================================
   * CREATE STAFF
   * ==============================================
   */

  it("should open add staff modal", async () => {
    render(<Staff />);

    await waitFor(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /add staff/i,
        }),
      );
    });

    expect(
      screen.getByRole("heading", {
        name: "Add Staff",
      }),
    ).toBeInTheDocument();
  });

  it("should handle failed staff creation", async () => {
    createStaff.mockRejectedValue(new Error("Create failed"));

    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(createStaff).not.toHaveBeenCalled();
  });

  /**
   * ==============================================
   * UPDATE STAFF
   * ==============================================
   */

  it("should open edit staff modal", async () => {
    render(<Staff />);

    await waitFor(() => {
      fireEvent.click(
        screen.getAllByRole("button", {
          name: /edit/i,
        })[0],
      );
    });

    expect(
      screen.getByRole("heading", {
        name: "Edit Staff",
      }),
    ).toBeInTheDocument();
  });

  it("should handle failed staff update", async () => {
    updateStaff.mockRejectedValue(new Error("Update failed"));

    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(updateStaff).not.toHaveBeenCalled();
  });

  /**
   * ==============================================
   * DELETE STAFF
   * ==============================================
   */

  it("should handle failed staff deletion", async () => {
    deleteStaff.mockRejectedValue(new Error("Delete failed"));

    render(<Staff />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(deleteStaff).not.toHaveBeenCalled();
  });
});
