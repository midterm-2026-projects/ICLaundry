import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NetProfitCard from "../components/NetProfitCard";

describe("NetProfitCard", () => {
  const profits = [
    "₱20,000",
    "₱35,000",
    "₱80,000",
  ];

  it.each(profits)(
    "should display net profit %s",
    (value) => {
      render(<NetProfitCard value={value} />);

      expect(screen.getByText(value))
        .toBeInTheDocument();
    }
  );
});