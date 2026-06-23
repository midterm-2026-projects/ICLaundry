import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TotalOrdersCard from "../components/TotalOrdersCard";

describe("TotalOrdersCard", () => {
  const orders = [10, 50, 100];

  it.each(orders)(
    "should display %s orders",
    (value) => {
      render(<TotalOrdersCard value={value} />);

      expect(
        screen.getByText(String(value))
      ).toBeInTheDocument();
    }
  );
});