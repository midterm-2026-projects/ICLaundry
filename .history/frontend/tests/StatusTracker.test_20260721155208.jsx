import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, it, expect, vi } from "vitest";

import StatusTracker from "../components/StatusTracker";

describe("StatusTracker", () => {
  it("should display current status badge", () => {
    render(<StatusTracker currentStatus="pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should render next status button", () => {
    render(<StatusTracker currentStatus="pending" />);

    expect(
      screen.getByRole("button", {
        name: /move to washing/i,
      }),
    ).toBeInTheDocument();
  });

  it("should hide next status button when released", () => {
    render(<StatusTracker currentStatus="released" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should update pending to washing", async () => {
    const user = userEvent.setup();

    const update = vi.fn();

    render(<StatusTracker currentStatus="pending" onStatusChange={update} />);

    await user.click(
      screen.getByRole("button", {
        name: /move to washing/i,
      }),
    );

    expect(update).toHaveBeenCalledWith("washing");
  });

  it("should update washing to drying", async () => {
    const user = userEvent.setup();

    const update = vi.fn();

    render(<StatusTracker currentStatus="washing" onStatusChange={update} />);

    await user.click(
      screen.getByRole("button", {
        name: /move to drying/i,
      }),
    );

    expect(update).toHaveBeenCalledWith("drying");
  });

  it("should render status dots", () => {
    const { container } = render(<StatusTracker currentStatus="folding" />);

    const dots = container.querySelectorAll(".status-dot");

    expect(dots.length).toBeGreaterThan(0);
  });

  it("should display unknown status", () => {
    render(<StatusTracker currentStatus="unknown" />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});
