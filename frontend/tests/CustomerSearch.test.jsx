// frontend/test/components/CustomerSearch.test.jsx

import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import CustomerSearch from "../components/CustomerSearch";

describe("CustomerSearch", () => {
  /**
   * ==============================================
   * RENDERING
   * ==============================================
   */

  it("should render customer search textbox", () => {
    // Arrange
    render(<CustomerSearch value="" onSearchChange={vi.fn()} />);

    // Act
    const input = screen.getByPlaceholderText(/search customers/i);

    // Assert
    expect(input).toBeInTheDocument();
  });

  it("should render empty search textbox initially", () => {
    // Arrange
    render(<CustomerSearch value="" onSearchChange={vi.fn()} />);

    // Act
    const input = screen.getByPlaceholderText(/search customers/i);

    // Assert
    expect(input).toHaveValue("");
  });

  it("should display provided search value", () => {
    // Arrange
    render(<CustomerSearch value="Juan" onSearchChange={vi.fn()} />);

    // Act
    const input = screen.getByPlaceholderText(/search customers/i);

    // Assert
    expect(input).toHaveValue("Juan");
  });

  /**
   * ==============================================
   * USER INTERACTION
   * ==============================================
   */

  it("should call onSearchChange when searching by customer name", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSearchChange = vi.fn();

    render(<CustomerSearch value="" onSearchChange={onSearchChange} />);

    const input = screen.getByPlaceholderText(/search customers/i);

    // Act
    await user.type(input, "Juan");

    // Assert
    expect(onSearchChange).toHaveBeenLastCalledWith("Juan");
  });

  it("should call onSearchChange when searching by phone number", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSearchChange = vi.fn();

    render(<CustomerSearch value="" onSearchChange={onSearchChange} />);

    const input = screen.getByPlaceholderText(/search customers/i);

    // Act
    await user.type(input, "09123456789");

    // Assert
    expect(onSearchChange).toHaveBeenLastCalledWith("09123456789");
  });

  it("should clear search textbox", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<CustomerSearch value="" onSearchChange={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search customers/i);

    // Act
    await user.type(input, "Juan");

    await user.clear(input);

    // Assert
    expect(input).toHaveValue("");
  });

  it("should support searching using email address", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSearchChange = vi.fn();

    render(<CustomerSearch value="" onSearchChange={onSearchChange} />);

    const input = screen.getByPlaceholderText(/search customers/i);

    // Act
    await user.type(input, "juan@gmail.com");

    // Assert
    expect(onSearchChange).toHaveBeenLastCalledWith("juan@gmail.com");
  });
});
