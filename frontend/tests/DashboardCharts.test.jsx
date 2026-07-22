import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import {
  RevenueTrendChart,
  WeeklyOrdersChart,
} from "../components/DashboardCharts";

it("renders weekly order values as an accessible bar chart", () => {
  render(
    <WeeklyOrdersChart
      data={[
        { id: "mon", label: "Mon", value: 4 },
        { id: "tue", label: "Tue", value: 6 },
      ]}
    />,
  );
  expect(
    screen.getByRole("region", { name: "Weekly Orders Chart" }),
  ).toHaveTextContent("10 orders");
  expect(
    screen.getByRole("img", { name: "Weekly orders bar chart" }),
  ).toBeInTheDocument();
});

it("shows safe empty states when the backend has no chart records", () => {
  render(
    <>
      <WeeklyOrdersChart />
      <RevenueTrendChart />
    </>,
  );
  expect(screen.getByText(/no order data/i)).toBeInTheDocument();
  expect(screen.getByText(/no revenue data/i)).toBeInTheDocument();
});
