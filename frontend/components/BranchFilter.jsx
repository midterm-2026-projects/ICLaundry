const BranchFilter = () => {
  const branches = [
    "All Branches",
    "Ermita, Balayan Branch",
    "Brgy. 7, Balayan Branch",
    "Nasugbu Branch",
  ];

  return (
    <select>
      {branches.map((branch) => (
        <option key={branch}>{branch}</option>
      ))}
    </select>
  );
};

export default BranchFilter;