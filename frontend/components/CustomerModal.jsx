import { useState } from "react";

export default function CustomerModal({
  editing,
}) {
  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setError(
        "Full Name, Phone Number, and Email are required."
      );
      return;
    }

    setError("");
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

      <textarea id="notes" />

      {error && <p>{error}</p>}

      <button onClick={handleSubmit}>
        {editing ? "Update" : "Add Customer"}
      </button>
    </div>
  );
}