// frontend/test/components/CustomerModal.test.jsx

import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import CustomerModal from "../components/CustomerModal";

describe("CustomerModal", () => {
  /**
   * ==============================================
   * ADD CUSTOMER
   * ==============================================
   */

  it("should display Add Customer heading", () => {
    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: /add customer/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display empty form fields", () => {
    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/customer name/i)).toHaveValue("");

    expect(screen.getByLabelText(/phone number/i)).toHaveValue("");

    expect(screen.getByLabelText(/email/i)).toHaveValue("");

    expect(screen.getByLabelText(/address/i)).toHaveValue("");

    expect(screen.getByLabelText(/notes/i)).toHaveValue("");
  });

  /**
   * ==============================================
   * EDIT CUSTOMER
   * ==============================================
   */

  it("should populate customer information when editing", () => {
    render(
      <CustomerModal
        isEditing
        customer={{
          id: "1",
          name: "Juan Dela Cruz",
          phone: "09123456789",
          email: "juan@gmail.com",
          address: "Batangas",
          notes: "Regular Customer",
        }}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: /edit customer/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/customer name/i)).toHaveValue(
      "Juan Dela Cruz",
    );

    expect(screen.getByLabelText(/phone number/i)).toHaveValue("09123456789");

    expect(screen.getByLabelText(/email/i)).toHaveValue("juan@gmail.com");

    expect(screen.getByLabelText(/address/i)).toHaveValue("Batangas");

    expect(screen.getByLabelText(/notes/i)).toHaveValue("Regular Customer");
  });

  /**
   * ==============================================
   * SUBMIT
   * ==============================================
   */

  it("should submit customer information", async () => {
    const user = userEvent.setup();

    const handleSubmit = vi.fn();

    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={handleSubmit}
        onClose={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/customer name/i), "Juan Dela Cruz");

    await user.type(screen.getByLabelText(/phone number/i), "09123456789");

    await user.type(screen.getByLabelText(/email/i), "juan@gmail.com");

    await user.type(screen.getByLabelText(/address/i), "Batangas");

    await user.type(screen.getByLabelText(/notes/i), "Regular Customer");

    await user.click(
      screen.getByRole("button", {
        name: /create customer/i,
      }),
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Juan Dela Cruz",
      phone: "09123456789",
      email: "juan@gmail.com",
      address: "Batangas",
      notes: "Regular Customer",
    });
  });

  /**
   * ==============================================
   * VALIDATION
   * ==============================================
   */

  it("should require customer name", async () => {
    const user = userEvent.setup();

    window.alert = vi.fn();

    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/phone number/i), "09123456789");

    await user.click(
      screen.getByRole("button", {
        name: /create customer/i,
      }),
    );

    expect(window.alert).toHaveBeenCalledWith("Customer name is required.");
  });

  it("should require phone number", async () => {
    const user = userEvent.setup();

    window.alert = vi.fn();

    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/customer name/i), "Juan");

    await user.click(
      screen.getByRole("button", {
        name: /create customer/i,
      }),
    );

    expect(window.alert).toHaveBeenCalledWith("Phone number is required.");
  });

  /**
   * ==============================================
   * CANCEL
   * ==============================================
   */

  it("should call onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();

    const handleClose = vi.fn();

    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={vi.fn()}
        onClose={handleClose}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  /**
   * ==============================================
   * BUTTON LABELS
   * ==============================================
   */

  it("should display Create Customer button in add mode", () => {
    render(
      <CustomerModal
        customer={null}
        isEditing={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /create customer/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display Update Customer button in edit mode", () => {
    render(
      <CustomerModal
        customer={{
          id: "1",
          name: "Juan",
          phone: "09123456789",
          email: "juan@gmail.com",
          address: "",
          notes: "",
        }}
        isEditing
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /update customer/i,
      }),
    ).toBeInTheDocument();
  });
});
