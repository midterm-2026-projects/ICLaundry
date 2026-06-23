import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CustomerModal from "../components/CustomerModal.jsx";
import CustomerActions from "../components/CustomerActions.jsx";

describe("CustomerModal", () => {
  it("Should display Full Name, Phone Number, Email, and Notes fields inside the modal", () => {
    // Arrange
    render(<CustomerModal editing={false} />);

    // Act
    const fullName =
      screen.getByLabelText("Full Name");

    const phone =
      screen.getByLabelText("Phone Number");

    const email =
      screen.getByLabelText("Email");

    const notes =
      screen.getByLabelText("Notes");

    // Assert
    expect(fullName).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(notes).toBeInTheDocument();
  });

  it("Should display Update and Delete action buttons", () => {
    // Arrange
    render(
      <>
        <CustomerModal editing />
        <CustomerActions
          setShowModal={() => {}}
          setEditing={() => {}}
        />
      </>
    );

    // Act
    const update = screen.getByRole("button", {
      name: "Update",
    });

    const deleteButton =
      screen.getByRole("button", {
        name: "Delete",
      });

    // Assert
    expect(update).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("Should prevent submission when required fields are empty", () => {
  // Arrange
  render(
    <CustomerModal editing={false} />
  );

  const button =
    screen.getByRole("button", {
      name: "Add Customer",
    });

  // Act
  fireEvent.click(button);

  // Assert
  expect(
    screen.getByText(
      "Full Name, Phone Number, and Email are required."
    )
  ).toBeInTheDocument();
});
});