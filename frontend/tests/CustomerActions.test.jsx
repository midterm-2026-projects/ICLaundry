import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import CustomerActions from "../components/CustomerActions";

describe("CustomerActions", () => {
  /**
   * ==============================================
   * RENDERING
   * ==============================================
   */

  it("should display the Add Customer button", () => {
    render(<CustomerActions onAddCustomer={vi.fn()} />);

    expect(
      screen.getByRole("button", {
        name: /add customer/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * ==============================================
   * USER INTERACTION
   * ==============================================
   */

  it("should call onAddCustomer when Add Customer button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const onAddCustomer = vi.fn();

    render(<CustomerActions onAddCustomer={onAddCustomer} />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /add customer/i,
      }),
    );

    // Assert
    expect(onAddCustomer).toHaveBeenCalledTimes(1);
  });

  it("should not call onAddCustomer before button is clicked", () => {
    // Arrange
    const onAddCustomer = vi.fn();

    render(<CustomerActions onAddCustomer={onAddCustomer} />);

    // Assert
    expect(onAddCustomer).not.toHaveBeenCalled();
  });

  it("should allow multiple button clicks", async () => {
    // Arrange
    const user = userEvent.setup();

    const onAddCustomer = vi.fn();

    render(<CustomerActions onAddCustomer={onAddCustomer} />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /add customer/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /add customer/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /add customer/i,
      }),
    );

    // Assert
    expect(onAddCustomer).toHaveBeenCalledTimes(3);
  });
});
