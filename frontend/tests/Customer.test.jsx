import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import Customer from "../components/Customer.jsx";

describe("Customer", () => {
  it("Should open the Add Customer modal when the button is clicked", () => {
    // Arrange
    render(<Customer />);

    const button =
      screen.getByRole("button", {
        name: "Add Customer",
      });

    // Act
    fireEvent.click(button);

    const result =
      screen.getByRole("heading", {
        name: "Add Customer",
      });

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("Should open the Edit Customer modal when the Edit button is clicked", () => {
    // Arrange
    render(<Customer />);

    const button =
      screen.getByRole("button", {
        name: "Edit Customer",
      });

    // Act
    fireEvent.click(button);

    const result =
      screen.getByRole("heading", {
        name: "Edit Customer",
      });

    // Assert
    expect(result).toBeInTheDocument();
  });
});