import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import StatusTracker from "../components/StatusTracker";

describe("StatusTracker", () => {
  it("should display current status badge", () => {
    render(<StatusTracker currentStatus="pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should display washing status", () => {
    render(<StatusTracker currentStatus="washing" />);

    expect(screen.getByText("Washing")).toBeInTheDocument();
  });

  it("should render next status button when next status exists", () => {
    render(<StatusTracker currentStatus="pending" onStatusChange={vi.fn()} />);

    expect(
      screen.getByRole("button", {
        name: /next status/i,
      }),
    ).toBeInTheDocument();
  });

  it("should hide next status button when order is released", () => {
    render(<StatusTracker currentStatus="released" />);

    expect(
      screen.queryByRole("button", {
        name: /next status/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("should call onStatusChange with washing", async () => {
    const user = userEvent.setup();

    const handleStatusChange = vi.fn();

    render(
      <StatusTracker
        currentStatus="pending"
        onStatusChange={handleStatusChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /next status/i,
      }),
    );

    expect(handleStatusChange).toHaveBeenCalledWith("washing");
  });

  it("should call onStatusChange with drying", async () => {
    const user = userEvent.setup();

    const handleStatusChange = vi.fn();

    render(
      <StatusTracker
        currentStatus="washing"
        onStatusChange={handleStatusChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /next status/i,
      }),
    );

    expect(handleStatusChange).toHaveBeenCalledWith("drying");
  });

  it("should render progress indicators", () => {
    const { container } = render(<StatusTracker currentStatus="folding" />);

    const bars = container.querySelectorAll(".h-2");

    expect(bars).toHaveLength(6);
  });

  it("should display unknown status when current status is invalid", () => {
    render(<StatusTracker currentStatus="unknown" />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});
