import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import CustomerSearch from "../components/CustomerSearch.jsx";

describe("CustomerSearch", () => {
  it("Should display the Customer search bar", () => {
    render(
      <CustomerSearch
        value=""
        onSearch={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Search customers..."
      )
    ).toBeInTheDocument();
  });

  it("Should update search value when user types", () => {
    const onSearch = vi.fn();

    render(
      <CustomerSearch
        value=""
        onSearch={onSearch}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Search customers..."
      ),
      {
        target: {
          value: "Juan",
        },
      }
    );

    expect(onSearch)
      .toHaveBeenCalledWith(
        "Juan"
      );
  });
});