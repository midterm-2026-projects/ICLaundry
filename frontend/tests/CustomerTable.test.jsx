import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CustomerTable from "../components/CustomerTable.jsx";

describe("CustomerTable", () => {
  it("Should display the Customer table with columns Name, Phone, Email, Added Date, and Actions", () => {
    // Arrange
    render(<CustomerTable />);

    const columns = [
      "Name",
      "Phone",
      "Email",
      "Added Date",
      "Actions",
    ];

    // Assert
    columns.forEach((column) => {
      expect(
        screen.getByText(column)
      ).toBeInTheDocument();
    });
  });
});