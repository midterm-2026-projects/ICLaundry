import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  role: "staff",
  position: "",
  branch_id: "",
};

const StaffModal = ({ open, mode, staff, branches, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && staff) {
      setForm({
        full_name: staff.full_name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        role: staff.role || "staff",
        position: staff.position || "",
        branch_id: staff.branch_id || "",
      });
    } else {
      setForm(initialState);
    }
  }, [open, mode, staff]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">
          {mode === "edit" ? "Edit Staff" : "Add Staff"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />

          <input
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="staff">Staff</option>

            <option value="admin">Admin</option>
          </select>

          <select
            name="branch_id"
            value={form.branch_id}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select Branch</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branch_name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-blue-600 px-5 py-2 text-white"
            >
              {mode === "edit" ? "Update Staff" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

StaffModal.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["add", "edit"]).isRequired,
  staff: PropTypes.object,
  branches: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default StaffModal;
