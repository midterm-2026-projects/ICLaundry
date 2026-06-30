import { useState } from "react";

const SearchInventory = ({
  onSearchChange,
}) => {
  const [searchTerm, setSearchTerm] =
    useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      <label htmlFor="searchInventory">
        Search Inventory
      </label>

      <input
        id="searchInventory"
        type="text"
        value={searchTerm}
        placeholder="Search items..."
        onChange={handleChange}
      />
    </>
  );
};

export default SearchInventory;