import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TotalRevenueCard from "../components/TotalRevenueCard";

describe("TotalRevenueCard", () => {
  const revenues = [
    "₱50,000",
    "₱100,000",
    "₱150,000",
  ];

  it.each(revenues)(
    "should display revenue value %s",
    (value) => {
      render(<TotalRevenueCard value={value} />);

      expect(screen.getByText(value))
        .toBeInTheDocument();
    }
  );
});