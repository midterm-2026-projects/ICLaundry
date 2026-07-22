// frontend/test/components/CustomerTable.test.jsx

import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import CustomerTable from "../components/CustomerTable";

describe("CustomerTable", () => {
  const customers = [
    {
      id: "1",
      name: "Juan Dela Cruz",
      phone: "09123456789",
      email: "juan@gmail.com",
      address: "Batangas",
      notes: "Regular Customer",
    },
    {
      id: "2",
      name: "Maria Santos",
      phone: "09987654321",
      email: "maria@gmail.com",
      address: "Lipa City",
      notes: "VIP Customer",
    },
  ];

  /**
   * ==============================================
   * TABLE RENDERING
   * ==============================================
   */

  it("should display all customers", () => {
    // Arrange
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("Juan Dela Cruz")).toBeInTheDocument();

    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
  });

  it("should display customer phone numbers", () => {
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("09123456789")).toBeInTheDocument();

    expect(screen.getByText("09987654321")).toBeInTheDocument();
  });

  it("should display customer email addresses", () => {
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("juan@gmail.com")).toBeInTheDocument();

    expect(screen.getByText("maria@gmail.com")).toBeInTheDocument();
  });

  it("should display customer addresses", () => {
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Batangas")).toBeInTheDocument();

    expect(screen.getByText("Lipa City")).toBeInTheDocument();
  });

  it("should display customer notes", () => {
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Regular Customer")).toBeInTheDocument();

    expect(screen.getByText("VIP Customer")).toBeInTheDocument();
  });

  it("should display empty state when there are no customers", () => {
    render(
      <CustomerTable customers={[]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
  });

  /**
   * ==============================================
   * EDIT CUSTOMER
   * ==============================================
   */

  it("should call onEdit when Edit button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const onEdit = vi.fn();

    render(
      <CustomerTable
        customers={customers}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    // Act
    await user.click(
      screen.getAllByRole("button", {
        name: /edit/i,
      })[0],
    );

    // Assert
    expect(onEdit).toHaveBeenCalledTimes(1);

    expect(onEdit).toHaveBeenCalledWith(customers[0]);
  });

  /**
   * ==============================================
   * DELETE CUSTOMER
   * ==============================================
   */

  it("should call onDelete when Delete button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const onDelete = vi.fn();

    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    // Act
    await user.click(
      screen.getAllByRole("button", {
        name: /delete/i,
      })[0],
    );

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1);

    expect(onDelete).toHaveBeenCalledWith(customers[0]);
  });

  it("should render one edit button for each customer", () => {
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole("button", {
        name: /edit/i,
      }),
    ).toHaveLength(2);
  });

  it("should render one delete button for each customer", () => {
    render(
      <CustomerTable
        customers={customers}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole("button", {
        name: /delete/i,
      }),
    ).toHaveLength(2);
  });
});
