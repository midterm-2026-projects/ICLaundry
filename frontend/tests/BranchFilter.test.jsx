import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import BranchFilter from "../components/BranchFilter";

describe("BranchFilter", () => {
  const mockData = [
    {
      id: 1,
      branch: "Ermita, Balayan Branch",
      revenue: 50000,
    },
    {
      id: 2,
      branch: "Brgy. 7, Balayan Branch",
      revenue: 75000,
    },
    {
      id: 3,
      branch: "Nasugbu Branch",
      revenue: 100000,
    },
  ];

  it("should display all branch data by default", () => {
    // Arrange
    render(<BranchFilter data={mockData} />);

    // Assert
    expect(
      screen.getByText("50000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("75000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("100000")
    ).toBeInTheDocument();
  });

  it("should display only Nasugbu data when Nasugbu Branch is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<BranchFilter data={mockData} />);

    const select = screen.getByRole("combobox");

    // Act
    await user.selectOptions(
      select,
      "Nasugbu Branch"
    );

    // Assert
    expect(
      screen.getByText("100000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("50000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("75000")
    ).not.toBeInTheDocument();
  });

  it("should display only Ermita data when Ermita Branch is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<BranchFilter data={mockData} />);

    const select = screen.getByRole("combobox");

    // Act
    await user.selectOptions(
      select,
      "Ermita, Balayan Branch"
    );

    // Assert
    expect(
      screen.getByText("50000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("75000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("100000")
    ).not.toBeInTheDocument();
  });

  it("should display only Brgy. 7 data when Brgy. 7 Branch is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<BranchFilter data={mockData} />);

    const select = screen.getByRole("combobox");

    // Act
    await user.selectOptions(
      select,
      "Brgy. 7, Balayan Branch"
    );

    // Assert
    expect(
      screen.getByText("75000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("50000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("100000")
    ).not.toBeInTheDocument();
  });

  it("should return all data when All Branches is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<BranchFilter data={mockData} />);

    const select = screen.getByRole("combobox");

    // Act
    await user.selectOptions(
      select,
      "Nasugbu Branch"
    );

    await user.selectOptions(
      select,
      "All Branches"
    );

    // Assert
    expect(
      screen.getByText("50000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("75000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("100000")
    ).toBeInTheDocument();
  });

  it("should render empty table when no data is provided", () => {
    // Arrange
    render(<BranchFilter />);

    // Assert
    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("50000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("75000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("100000")
    ).not.toBeInTheDocument();
  });
});