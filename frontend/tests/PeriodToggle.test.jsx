import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import PeriodToggle from "../components/PeriodToggle";

describe("PeriodToggle", () => {
  const mockData = [
    {
      id: 1,
      period: "Weekly",
      revenue: "₱10,000",
    },
    {
      id: 2,
      period: "Monthly",
      revenue: "₱50,000",
    },
    {
      id: 3,
      period: "Yearly",
      revenue: "₱500,000",
    },
  ];

  it("should display weekly data by default", () => {
    // Arrange
    render(<PeriodToggle data={mockData} />);

    // Assert
    expect(
      screen.getByText("₱10,000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("₱50,000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("₱500,000")
    ).not.toBeInTheDocument();
  });

  it("should filter monthly data when Monthly is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<PeriodToggle data={mockData} />);

    const monthlyButton =
      screen.getByRole("button", {
        name: "Monthly",
      });

    // Act
    await user.click(monthlyButton);

    // Assert
    expect(
      screen.getByText("₱50,000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("₱10,000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("₱500,000")
    ).not.toBeInTheDocument();
  });

  it("should filter yearly data when Yearly is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<PeriodToggle data={mockData} />);

    const yearlyButton =
      screen.getByRole("button", {
        name: "Yearly",
      });

    // Act
    await user.click(yearlyButton);

    // Assert
    expect(
      screen.getByText("₱500,000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("₱10,000")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("₱50,000")
    ).not.toBeInTheDocument();
  });

  it("should return weekly data when Weekly is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<PeriodToggle data={mockData} />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: "Monthly",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Weekly",
      })
    );

    // Assert
    expect(
      screen.getByText("₱10,000")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("₱50,000")
    ).not.toBeInTheDocument();
  });

  it("should render empty table when no data is provided", () => {
    // Arrange
    render(<PeriodToggle />);

    // Assert
    expect(
      screen.getByText(
        "Selected Period: Weekly"
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("row")
    ).not.toBeInTheDocument();
  });
});