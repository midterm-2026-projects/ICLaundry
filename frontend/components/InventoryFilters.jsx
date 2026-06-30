import { useState } from "react";

const branches = [
  "All Branches",
  "Main - Brgy 7",
  "2nd Branch - Brgy Calzada",
  "3rd Branch - Nasugbu",
];

const InventoryFilters = ({
  onSearchChange,
  onBranchChange,
}) => {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState(
    "All Branches"
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleBranchChange = (e) => {
    const value = e.target.value;

    setSelectedBranch(value);

    if (onBranchChange) {
      onBranchChange(value);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="searchInventory">
          Search Inventory
        </label>

        <input
          id="searchInventory"
          type="text"
          value={searchTerm}
          placeholder="Search items..."
          onChange={
            handleSearchChange
          }
        />
      </div>

      <div>
        <label htmlFor="branchFilter">
          Branch Filter
        </label>

        <select
          id="branchFilter"
          value={selectedBranch}
          onChange={
            handleBranchChange
          }
        >
          {branches.map((branch) => (
            <option
              key={branch}
              value={branch}
            >
              {branch}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default InventoryFilters;