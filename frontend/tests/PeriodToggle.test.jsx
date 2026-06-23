import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PeriodToggle from "../components/PeriodToggle";

describe("PeriodToggle", () => {
  const periods = ["Weekly", "Monthly", "Yearly"];

  it.each(periods)("should render %s button", (period) => {
    render(<PeriodToggle />);

    expect(
      screen.getByRole("button", { name: period })
    ).toBeInTheDocument();
  });
});