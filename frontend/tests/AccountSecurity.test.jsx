import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// ✅ Imported correctly as Settings
import Settings from "../src/pages/AccountSecuritySettings.jsx";

describe("Week 4 Day 1 - Settings Page (Structure)", () => {
  it("should render the Settings page title", () => {
    render(<Settings />);
    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
  });

  it("should render the Account Security section title", () => {
    render(<Settings />);
    expect(screen.getByRole("heading", { name: /account security/i })).toBeInTheDocument();
  });

  it("should render the Account Security description text", () => {
    render(<Settings />);
    expect(screen.getByText(/manage your password and security settings/i)).toBeInTheDocument();
  });

  it("should render the Account Security card container", () => {
    render(<Settings />);
    const card = screen.getByText(/account security/i).closest(".rounded-xl");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("bg-white");
  });

  it("should display the Email label", () => {
    render(<Settings />);
    expect(screen.getByText(/^email$/i)).toBeInTheDocument();
  });

  it("should display the administrator email address", () => {
    render(<Settings />);
    expect(screen.getByDisplayValue("admin@IClaundry.com")).toBeInTheDocument();
  });

  it("should render the CHANGE PASSWORD section header", () => {
    render(<Settings />);
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
  });

  it("should render the Current Password input field with label", () => {
    render(<Settings />);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
  });

  it("should show correct placeholder for Current Password", () => {
    render(<Settings />);
    expect(screen.getByPlaceholderText(/enter current password/i)).toBeInTheDocument();
  });

  it("should render the New Password input field with exact label", () => {
    render(<Settings />);
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
  });

  it("should show correct placeholder for New Password", () => {
    render(<Settings />);
    expect(screen.getByPlaceholderText(/min 6 characters/i)).toBeInTheDocument();
  });

  it("should render the Confirm New Password input field with label", () => {
    render(<Settings />);
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
  });

  it("should show correct placeholder for Confirm New Password", () => {
    render(<Settings />);
    expect(screen.getByPlaceholderText(/re-enter new password/i)).toBeInTheDocument();
  });

  it("should render the Update Password button", () => {
    render(<Settings />);
    expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
  });

  it("should render the password visibility toggle icons (eye buttons)", () => {
    render(<Settings />);
    const allButtons = screen.getAllByRole("button");
    const toggleButtons = allButtons.filter(btn => !btn.textContent?.includes("Update Password"));
    expect(toggleButtons).toHaveLength(3);
  });
});

describe("Week 4 Day 1 - Update Password (Behavior / Outcome)", () => {
  it("shows 'All fields are required' when clicking Update Password with empty fields", () => {
    render(<Settings />);
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  it("shows 'All fields are required' when only Current Password is filled", () => {
    render(<Settings />);
    fireEvent.change(screen.getByPlaceholderText(/enter current password/i), {
      target: { value: "test123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  it("shows error when New Password is less than 6 characters", () => {
    render(<Settings />);
    fireEvent.change(screen.getByPlaceholderText(/enter current password/i), {
      target: { value: "test123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/min 6 characters/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/re-enter new password/i), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    expect(screen.getByText(/new password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("shows error when New Password and Confirm New Password do not match", () => {
    render(<Settings />);
    fireEvent.change(screen.getByPlaceholderText(/enter current password/i), {
      target: { value: "test123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/min 6 characters/i), {
      target: { value: "newpass1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/re-enter new password/i), {
      target: { value: "different1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    expect(screen.getByText(/new password and confirmation do not match/i)).toBeInTheDocument();
  });

  it("shows success message and clears all fields when everything is valid", () => {
    render(<Settings />);

    const currentInput = screen.getByPlaceholderText(/enter current password/i);
    const newInput = screen.getByPlaceholderText(/min 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/re-enter new password/i);

    fireEvent.change(currentInput, { target: { value: "test123" } });
    fireEvent.change(newInput, { target: { value: "newpass1" } });
    fireEvent.change(confirmInput, { target: { value: "newpass1" } });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument();
    expect(currentInput.value).toBe("");
    expect(newInput.value).toBe("");
    expect(confirmInput.value).toBe("");
  });

  it("toggles Current Password visibility when eye icon is clicked", () => {
    render(<Settings />);
    const currentInput = screen.getByPlaceholderText(/enter current password/i);
    expect(currentInput.type).toBe("password");

    const allButtons = screen.getAllByRole("button");
    const toggleButtons = allButtons.filter(btn => !btn.textContent?.includes("Update Password"));

    fireEvent.click(toggleButtons[0]);
    // ✅ Fixed: expects "text" instead of the success message
    expect(currentInput.type).toBe("text");
  });
});