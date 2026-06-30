import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import SearchInventory from "../components/SearchInventory";

describe("SearchInventory", () => {
  it("should render search textbox", () => {
    // Arrange
    render(
      <SearchInventory
        onSearchChange={vi.fn()}
      />
    );

    // Act
    const textbox =
      screen.getByRole("textbox");

    // Assert
    expect(textbox)
      .toBeInTheDocument();
  });

  it("should render empty textbox initially", () => {
    // Arrange
    render(
      <SearchInventory
        onSearchChange={vi.fn()}
      />
    );

    // Act
    const textbox =
      screen.getByRole("textbox");

    // Assert
    expect(textbox)
      .toHaveValue("");
  });

  it("should call onSearchChange when user types item name", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleSearch =
      vi.fn();

    render(
      <SearchInventory
        onSearchChange={
          handleSearch
        }
      />
    );

    const textbox =
      screen.getByRole("textbox");

    // Act
    await user.type(
      textbox,
      "Ariel"
    );

    // Assert
    expect(handleSearch)
      .toHaveBeenCalled();
  });

  it("should allow user to search detergent item", async () => {
    // Arrange
    const user =
      userEvent.setup();

    render(
      <SearchInventory
        onSearchChange={vi.fn()}
      />
    );

    const textbox =
      screen.getByRole("textbox");

    // Act
    await user.type(
      textbox,
      "Detergent"
    );

    // Assert
    expect(textbox)
      .toHaveValue(
        "Detergent"
      );
  });
});