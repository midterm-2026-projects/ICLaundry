const BranchFilter = ({ selectedBranch = "", onBranchChange, branches = [] }) => (
  <div className="analytics-filter-field analytics-branch-filter">
    <label htmlFor="analyticsBranch">Branch</label>
    <select id="analyticsBranch" value={selectedBranch} onChange={(event) => onBranchChange?.(event.target.value)}>
      <option value="">All Branches</option>
      {branches.map((branch) => (
        <option key={branch.id} value={branch.id}>{branch.branch_name || branch.name}</option>
      ))}
    </select>
  </div>
);

export default BranchFilter;
