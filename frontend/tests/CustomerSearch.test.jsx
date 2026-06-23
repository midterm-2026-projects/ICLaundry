import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CustomerSearch from "../components/CustomerSearch.jsx";

describe("CustomerSearch", () => {
  it("Should display the Customer search bar", () => {
    // Arrange
    render(<CustomerSearch />);

    // Act
    const result = screen.getByPlaceholderText(
      "Search customers..."
    );

    // Assert
    expect(result).toBeInTheDocument();
  });
});