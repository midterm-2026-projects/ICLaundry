import { render } from "@testing-library/react";
import { RevenueTrendChart } from "../components/DashboardCharts";
import { vi } from "vitest";

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useEffect: actual.useEffect,
    useState: actual.useState,
  };
});

vi.mock("../../components/SharedUI/SharedUI", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useChartColors: () => [
      { solid: "#10b981", lighter: "#dcfce7", border: "#34d399" },
    ],
  };
});

it("renders revenue analytics correctly", () => {
  const { container } = render(
    <RevenueTrendChart
      data={[{ id: "mon", label: "Mon", value: 750 }, { id: "tue", label: "Tue", value: 1250 }]}
    />
  );

  console.log("Container HTML:", container.innerHTML);

  const section = container.querySelector("section.weekly-revenue-trend");
  expect(section).toBeInTheDocument();
});