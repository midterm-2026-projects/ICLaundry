import { render, screen } from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import CustomerTable from "../components/CustomerTable.jsx";

describe("CustomerTable", () => {
  it("Should display the Customer table with columns Name, Phone, Email, Added Date, and Actions", () => {
    render(<CustomerTable />);

    [
      "Name",
      "Phone",
      "Email",
      "Added Date",
      "Actions",
    ].forEach((column) => {
      expect(
        screen.getByText(column)
      ).toBeInTheDocument();
    });
  });

  it("Should render customer data in the table", () => {
    render(
      <CustomerTable
       customers={[
  {
    id: 1,
    fullName: "Juan Dela Cruz",
    phone: "09171234567",
    email: "juan@gmail.com",
    addedDate: "2025-06-23",
  },
]}
      />
    );

    expect(
      screen.getByText(
        "Juan Dela Cruz"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "09171234567"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "juan@gmail.com"
      )
    ).toBeInTheDocument();
  });
});