export default function CustomerSearch({
  value = "",
  onSearch,
}) {
  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <input
      placeholder="Search customers..."
      value={value}
      onChange={handleSearch}
    />
  );
}