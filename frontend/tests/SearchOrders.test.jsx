import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import SearchOrders from "../components/SearchOrders";

describe("SearchOrders", () => {
  it("should render search input", () => {
    render(<SearchOrders value="" onSearchChange={vi.fn()} />);

    expect(
      screen.getByPlaceholderText(/search order number, customer/i),
    ).toBeInTheDocument();
  });

  it("should display initial value", () => {
    render(<SearchOrders value="ORD001" onSearchChange={vi.fn()} />);

    expect(screen.getByDisplayValue("ORD001")).toBeInTheDocument();
  });

  it("should allow user to type", async () => {
    const user = userEvent.setup();

    render(<SearchOrders value="" onSearchChange={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search order number, customer/i);

    await user.type(input, "ORD001");

    expect(input).toHaveValue("ORD001");
  });

  it("should call onSearchChange when typing order number", async () => {
    const user = userEvent.setup();

    const handleSearch = vi.fn();

    render(<SearchOrders value="" onSearchChange={handleSearch} />);

    const input = screen.getByPlaceholderText(/search order number, customer/i);

    await user.type(input, "ORD001");

    expect(handleSearch).toHaveBeenLastCalledWith("ORD001");
  });

  it("should call onSearchChange when typing customer name", async () => {
    const user = userEvent.setup();

    const handleSearch = vi.fn();

    render(<SearchOrders value="" onSearchChange={handleSearch} />);

    const input = screen.getByPlaceholderText(/search order number, customer/i);

    await user.type(input, "Juan");

    expect(handleSearch).toHaveBeenLastCalledWith("Juan");
  });

  it("should clear input", async () => {
    const user = userEvent.setup();

    render(<SearchOrders value="" onSearchChange={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search order number, customer/i);

    await user.type(input, "ORD001");

    await user.clear(input);

    expect(input).toHaveValue("");
  });

  it("should update when value prop changes", () => {
    const { rerender } = render(
      <SearchOrders value="ORD001" onSearchChange={vi.fn()} />,
    );

    expect(screen.getByDisplayValue("ORD001")).toBeInTheDocument();

    rerender(<SearchOrders value="ORD002" onSearchChange={vi.fn()} />);

    expect(screen.getByDisplayValue("ORD002")).toBeInTheDocument();
  });

  it("should render custom placeholder", () => {
    render(
      <SearchOrders
        value=""
        placeholder="Search customer..."
        onSearchChange={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText("Search customer..."),
    ).toBeInTheDocument();
  });
});
