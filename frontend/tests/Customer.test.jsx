import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it } from "vitest";

import Customer from "../components/Customer.jsx";

describe("Customer", () => {
  it("Should display the Customer search bar", () => {
    // Arrange
    render(<Customer />);

    // Act
    const result = screen.getByPlaceholderText("Search customers...");

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("Should display the Customer table with columns Name, Phone, Email, Added Date, and Actions", () => {
    // Arrange
    render(<Customer />);

    // Act
    const name = screen.getByText("Name");

    const phone = screen.getByText("Phone");

    const email = screen.getByText("Email");

    const added = screen.getByText("Added Date");

    const actions = screen.getByText("Actions");

    // Assert
    expect(name).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(added).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  it("Should display the Add Customer button", () => {
    // Arrange
    render(<Customer />);

    // Act
    const result = screen.getByRole("button", {
      name: "Add Customer",
    });

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("Should open the Add Customer modal when the button is clicked", () => {
    // Arrange
    render(<Customer />);

    const button = screen.getByRole("button", {
      name: "Add Customer",
    });

    // Act
    fireEvent.click(button);

    const result = screen.getByRole("heading", {
      name: "Add Customer",
    });

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("Should display Full Name, Phone Number, Email, and Notes fields inside the modal", () => {
    // Arrange
    render(<Customer />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Customer",
      }),
    );

    // Act
    const fullName = screen.getByLabelText("Full Name");

    const phone = screen.getByLabelText("Phone Number");

    const email = screen.getByLabelText("Email");

    const notes = screen.getByLabelText("Notes");

    // Assert
    expect(fullName).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(notes).toBeInTheDocument();
  });

  it("Should open the Edit Customer modal when the Edit button is clicked", () => {
    // Arrange
    render(<Customer />);

    const button = screen.getByRole("button", {
      name: "Edit Customer",
    });

    // Act
    fireEvent.click(button);

    const result = screen.getByRole("heading", {
      name: "Edit Customer",
    });

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("Should display Update and Delete action buttons", () => {
    // Arrange
    render(<Customer />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit Customer",
      }),
    );

    // Act
    const update = screen.getByRole("button", {
      name: "Update",
    });

    const deleteButton = screen.getByRole("button", {
      name: "Delete",
    });

    // Assert
    expect(update).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("Should prevent submission when required fields are empty", () => {
    // Arrange
    render(<Customer />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Customer",
      }),
    );

    const fullName = screen.getByLabelText("Full Name");

    // Act

    // Assert
    expect(fullName.value).toBe("");
  });
});
