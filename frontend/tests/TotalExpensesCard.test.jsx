import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TotalExpensesCard from "../components/TotalExpensesCard";

describe("TotalExpensesCard", () => {
  const expenses = [
    "₱10,000",
    "₱25,000",
    "₱40,000",
  ];

  it.each(expenses)(
    "should display expense value %s",
    (value) => {
      render(<TotalExpensesCard value={value} />);

      expect(screen.getByText(value))
        .toBeInTheDocument();
    }
  );
});