import PropTypes from "prop-types";

const StaffTable = ({ staff, onEdit, onDelete }) => {
  if (staff.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-gray-500">No staff records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Full Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Position</th>
            <th className="px-4 py-3 text-left">Branch</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-t">
              <td className="px-4 py-3">{member.full_name}</td>

              <td className="px-4 py-3">{member.email}</td>

              <td className="px-4 py-3">{member.phone || "-"}</td>

              <td className="px-4 py-3 capitalize">{member.role}</td>

              <td className="px-4 py-3">{member.position || "-"}</td>

              <td className="px-4 py-3">
                {member.branch_name ?? member.branch?.branch_name ?? "-"}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(member)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

StaffTable.propTypes = {
  staff: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StaffTable;
