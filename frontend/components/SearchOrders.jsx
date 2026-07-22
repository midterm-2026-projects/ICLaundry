// frontend/src/components/SearchOrders.jsx

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchOrders = ({
  value = "",
  onSearchChange,
  placeholder = "Search Order Number, Customer...",
}) => {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleChange = (event) => {
    const value = event.target.value;

    setSearchValue(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="search-box">
      <Search />
      <input
        id="searchOrders"
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchOrders;
