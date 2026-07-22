import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import PriceBreakdownCard from "../components/PriceBreakdownCard";

describe("PriceBreakdownCard", () => {
  it("should display price breakdown heading", () => {
    render(<PriceBreakdownCard laundryCost={200} totalAmount={350} />);

    expect(screen.getByText("Price Breakdown")).toBeInTheDocument();
  });

  it("should display laundry cost", () => {
    render(<PriceBreakdownCard laundryCost={200} totalAmount={350} />);

    expect(screen.getByText("₱200.00")).toBeInTheDocument();
  });

  it("should display total amount", () => {
    render(<PriceBreakdownCard laundryCost={200} totalAmount={350} />);

    expect(screen.getByText("₱350.00")).toBeInTheDocument();
  });

  it("should display weight when provided", () => {
    render(
      <PriceBreakdownCard weight={5} laundryCost={200} totalAmount={200} />,
    );

    expect(screen.getByText("Weight")).toBeInTheDocument();

    expect(screen.getByText("5 kg")).toBeInTheDocument();
  });

  it("should display price per kg when provided", () => {
    render(
      <PriceBreakdownCard
        pricePerKg={25}
        laundryCost={200}
        totalAmount={200}
      />,
    );

    expect(screen.getByText("Price / Kg")).toBeInTheDocument();

    expect(screen.getByText("₱25.00")).toBeInTheDocument();
  });

  it("should hide optional fields when not provided", () => {
    render(<PriceBreakdownCard laundryCost={200} totalAmount={200} />);

    expect(screen.queryByText("Weight")).not.toBeInTheDocument();

    expect(screen.queryByText("Price / Kg")).not.toBeInTheDocument();
  });

  it("should display zero values correctly", () => {
    render(
      <PriceBreakdownCard
        weight={0}
        pricePerKg={0}
        laundryCost={0}
        totalAmount={0}
      />,
    );

    expect(screen.getAllByText("₱0.00")).toHaveLength(3);

    expect(screen.getByText("0 kg")).toBeInTheDocument();
  });
});
