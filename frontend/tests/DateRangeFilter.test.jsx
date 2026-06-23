import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DateRangeFilter from "../components/DateRangeFilter";

describe("DateRangeFilter", () => {
  const labels = ["Start Date", "End Date"];

  it.each(labels)("should render %s field", (label) => {
    render(<DateRangeFilter />);

    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });
});