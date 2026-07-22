import { Plus, Search, SlidersHorizontal, X } from "lucide-react";

const StaffToolbar = ({ search, onSearchChange, roleFilter, onRoleFilterChange, branchFilter, onBranchFilterChange, branches = [], onAddStaff, onClear }) => (
  <section className="staff-toolbar" aria-label="Staff filters">
    <label className="staff-search">
      <Search size={17} aria-hidden="true" />
      <span className="sr-only">Search staff</span>
      <input aria-label="Search staff" type="search" placeholder="Search by name, email, phone, or position..." value={search} onChange={(event) => onSearchChange(event.target.value)} />
    </label>
    <label className="staff-filter">
      <SlidersHorizontal size={16} aria-hidden="true" /><span className="sr-only">Role</span>
      <select aria-label="Role" value={roleFilter} onChange={(event) => onRoleFilterChange(event.target.value)}>
        <option value="">All Roles</option><option value="admin">Admin</option><option value="staff">Staff</option>
      </select>
    </label>
    <label className="staff-filter">
      <span className="sr-only">Branch</span>
      <select aria-label="Branch" value={branchFilter} onChange={(event) => onBranchFilterChange(event.target.value)}>
        <option value="">All Branches</option>
        {branches.map((branch) => <option key={branch.id} value={String(branch.id)}>{branch.branch_name}</option>)}
      </select>
    </label>
    {(search || roleFilter || branchFilter) && <button type="button" className="staff-clear" onClick={onClear}><X size={15} /> Clear</button>}
    <button type="button" className="btn btn-primary staff-add-mobile" onClick={onAddStaff}><Plus size={17} /> Add Staff</button>
  </section>
);

export default StaffToolbar;
