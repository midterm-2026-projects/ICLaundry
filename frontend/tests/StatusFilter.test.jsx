import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import StatusFilter from "../components/StatusFilter";

describe("StatusFilter", () => {
  it("should render all status buttons", () => {
    render(<StatusFilter selectedStatus="all" onStatusChange={vi.fn()} />);

    expect(
      screen.getByRole("button", {
        name: /all/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /pending/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /washing/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /drying/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /folding/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /ready for pick-up/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /released/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /cancelled/i,
      }),
    ).toBeInTheDocument();
  });

  it("should call onStatusChange when Pending is clicked", async () => {
    const user = userEvent.setup();

    const handleStatusChange = vi.fn();

    render(
      <StatusFilter selectedStatus="all" onStatusChange={handleStatusChange} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /pending/i,
      }),
    );

    expect(handleStatusChange).toHaveBeenCalledWith("pending");
  });

  it("should call onStatusChange when Washing is clicked", async () => {
    const user = userEvent.setup();

    const handleStatusChange = vi.fn();

    render(
      <StatusFilter selectedStatus="all" onStatusChange={handleStatusChange} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /washing/i,
      }),
    );

    expect(handleStatusChange).toHaveBeenCalledWith("washing");
  });

  it("should call onStatusChange when Ready is clicked", async () => {
    const user = userEvent.setup();

    const handleStatusChange = vi.fn();

    render(
      <StatusFilter selectedStatus="all" onStatusChange={handleStatusChange} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /ready for pick-up/i,
      }),
    );

    expect(handleStatusChange).toHaveBeenCalledWith("ready");
  });

  it("should call onStatusChange when Cancelled is clicked", async () => {
    const user = userEvent.setup();

    const handleStatusChange = vi.fn();

    render(
      <StatusFilter selectedStatus="all" onStatusChange={handleStatusChange} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancelled/i,
      }),
    );

    expect(handleStatusChange).toHaveBeenCalledWith("cancelled");
  });
});
