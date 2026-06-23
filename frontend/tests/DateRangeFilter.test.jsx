import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import DateRangeFilter from "../components/DateRangeFilter";

describe("DateRangeFilter", () => {
  it("should render even when no date is selected", () => {
    // Arrange
    render(<DateRangeFilter />);

    // Assert
    expect(
      screen.getByText(
        "Start: No date selected"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "End: No date selected"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Displaying all records"
      )
    ).toBeInTheDocument();
  });

  it("should update start date when user selects a date", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DateRangeFilter />);

    const startDateInput =
      screen.getByLabelText("Start Date");

    // Act
    await user.type(
      startDateInput,
      "2026-06-23"
    );

    // Assert
    expect(startDateInput).toHaveValue(
      "2026-06-23"
    );
  });

  it("should update end date when user selects a date", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DateRangeFilter />);

    const endDateInput =
      screen.getByLabelText("End Date");

    // Act
    await user.type(
      endDateInput,
      "2026-06-30"
    );

    // Assert
    expect(endDateInput).toHaveValue(
      "2026-06-30"
    );
  });

  it("should display filtered records when both dates are selected", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DateRangeFilter />);

    const startDateInput =
      screen.getByLabelText("Start Date");

    const endDateInput =
      screen.getByLabelText("End Date");

    // Act
    await user.type(
      startDateInput,
      "2026-06-23"
    );

    await user.type(
      endDateInput,
      "2026-06-30"
    );

    // Assert
    expect(
      screen.getByText(
        "Displaying records from 2026-06-23 to 2026-06-30"
      )
    ).toBeInTheDocument();
  });
});