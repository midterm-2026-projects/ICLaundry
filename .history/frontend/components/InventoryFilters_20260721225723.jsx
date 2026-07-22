import { Search } from "lucide-react";

const branchOptions = ["All Branches", "Main - Brgy 7", "Calzada", "Nasugbu"];

const InventoryFilters = ({
  searchTerm = "",
  selectedBranch = "All Branches",
  onSearchChange,
  onBranchChange,
  disabled = false,
}) => {
  const handleSearchChange = (event) => {
    onSearchChange?.(event.target.value);
  };

  const handleBranchChange = (event) => {
    onBranchChange?.(event.target.value);
  };

  const clearFilters = () => {
    onSearchChange?.("");
    onBranchChange?.("All Branches");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedBranch !== "All Branches";

  return (
    <div className="inventory-filters">
      <div className="inventory-search-wrapper">
        <Search
          className="inventory-search-icon"
          size={18}
          aria-hidden="true"
        />

        <label htmlFor="inventorySearch" className="sr-only">
          Search inventory
        </label>

        <input
          id="inventorySearch"
          name="inventorySearch"
          type="search"
          placeholder="Search item, category, branch, or unit..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={disabled}
          autoComplete="off"
          className="inventory-search-input"
        />
      </div>

      <div className="inventory-branch-filter">
        <label htmlFor="inventoryBranch" className="sr-only">
          Filter inventory by branch
        </label>

        <select
          id="inventoryBranch"
          name="inventoryBranch"
          value={selectedBranch}
          onChange={handleBranchChange}
          disabled={disabled}
          className="inventory-branch-select"
        >
          {branchOptions.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="inventory-clear-filter-button"
        onClick={clearFilters}
        disabled={disabled || !hasActiveFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default InventoryFilters;
