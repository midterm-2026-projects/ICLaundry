import { useState } from "react";

const BranchFilters = ({
  onBranchChange,
}) => {
  const branches = [
    "All Branches",
    "Main - Brgy 7",
    "2nd Branch - Brgy Calzada",
    "3rd Branch - Nasugbu",
  ];

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState(
    "All Branches"
  );

  const handleChange = (e) => {
    const value = e.target.value;

    setSelectedBranch(value);

    if (onBranchChange) {
      onBranchChange(value);
    }
  };

  return (
    <>
      <label htmlFor="branchFilter">
        Branch Filter
      </label>

      <select
        id="branchFilter"
        value={selectedBranch}
        onChange={handleChange}
      >
        {branches.map(
          (branch) => (
            <option
              key={branch}
              value={branch}
            >
              {branch}
            </option>
          )
        )}
      </select>
    </>
  );
};

export default BranchFilters;