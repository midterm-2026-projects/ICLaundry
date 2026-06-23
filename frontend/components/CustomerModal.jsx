import { useState } from "react";

export default function CustomerModal({
  editing,
  onAddCustomer,
  onUpdate,
}) {
  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [error, setError] =
    useState("");

  const customerData = {
    fullName,
    phone,
    email,
    notes,
  };

  const validateFields = () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setError(
        "Full Name, Phone Number, and Email are required."
      );

      return false;
    }

    setError("");

    return true;
  };

  const handleAddCustomer = () => {
    if (!validateFields()) {
      return;
    }

    onAddCustomer?.(customerData);
  };

  const handleUpdate = () => {
    if (!validateFields()) {
      return;
    }

    onUpdate?.(customerData);
  };

  return (
    <div>
      <h2>
        {editing
          ? "Edit Customer"
          : "Add Customer"}
      </h2>

      <label htmlFor="fullName">
        Full Name
      </label>

      <input
        id="fullName"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
      />

      <label htmlFor="phone">
        Phone Number
      </label>

      <input
        id="phone"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
      />

      <label htmlFor="email">
        Email
      </label>

      <input
        id="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <label htmlFor="notes">
        Notes
      </label>

      <textarea
        id="notes"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
      />

      {error && <p>{error}</p>}

      <button
        onClick={
          editing
            ? handleUpdate
            : handleAddCustomer
        }
      >
        {editing
          ? "Update"
          : "Add Customer"}
      </button>
    </div>
  );
}