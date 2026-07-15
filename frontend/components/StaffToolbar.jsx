import PropTypes from "prop-types";

const StaffToolbar = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  branchFilter,
  onBranchFilterChange,
  branches,
  onAddStaff,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>

        <select
          value={branchFilter}
          onChange={(e) => onBranchFilterChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">All Branches</option>

          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.branch_name}
            </option>
          ))}
        </select>

        <button
          onClick={onAddStaff}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Add Staff
        </button>
      </div>
    </div>
  );
};

StaffToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  roleFilter: PropTypes.string.isRequired,
  onRoleFilterChange: PropTypes.func.isRequired,
  branchFilter: PropTypes.string.isRequired,
  onBranchFilterChange: PropTypes.func.isRequired,
  branches: PropTypes.array.isRequired,
  onAddStaff: PropTypes.func.isRequired,
};

export default StaffToolbar;
