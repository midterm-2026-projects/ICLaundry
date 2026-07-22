import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const CustomerSearch = ({
  value = "",
  onSearchChange,
  placeholder = "Search customers...",
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
    <div className="customer-search-box">
      <Search size={18} aria-hidden="true" />
      <label htmlFor="searchCustomers" className="sr-only">
        Search customers
      </label>
      <input
        id="searchCustomers"
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomerSearch;
