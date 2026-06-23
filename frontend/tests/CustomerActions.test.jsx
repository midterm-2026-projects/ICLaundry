import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CustomerActions from "../components/CustomerActions.jsx";

describe("CustomerActions", () => {
  it("Should display the Add Customer button", () => {
    // Arrange
    render(
      <CustomerActions
        setShowModal={() => {}}
        setEditing={() => {}}
      />
    );

    // Act
    const result = screen.getByRole("button", {
      name: "Add Customer",
    });

    // Assert
    expect(result).toBeInTheDocument();
  });
});