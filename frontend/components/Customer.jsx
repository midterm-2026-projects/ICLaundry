import { useState } from "react";

export default function Customer() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <input placeholder="Search customers..." />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Added Date</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>

      <button
        onClick={() => {
          setEditing(false);
          setShowModal(true);
        }}
      >
        Add Customer
      </button>

      <button
        onClick={() => {
          setEditing(true);
          setShowModal(true);
        }}
      >
        Edit Customer
      </button>

      <button>Delete</button>

      {showModal && (
        <div>
          <h2>{editing ? "Edit Customer" : "Add Customer"}</h2>

          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" />

          <label htmlFor="phone">Phone Number</label>
          <input id="phone" />

          <label htmlFor="email">Email</label>
          <input id="email" />

          <label htmlFor="notes">Notes</label>
          <textarea id="notes" />

          <button>{editing ? "Update" : "Add Customer"}</button>
        </div>
      )}
    </>
  );
}
