import { useState } from "react";

const BranchFilter = ({ data = [] }) => {
  const branches = [
    "All Branches",
    "Ermita, Balayan Branch",
    "Brgy. 7, Balayan Branch",
    "Nasugbu Branch",
  ];

  const [selectedBranch, setSelectedBranch] =
    useState("All Branches");

  const filteredData =
    selectedBranch === "All Branches"
      ? data
      : data.filter(
          (item) =>
            item.branch === selectedBranch
        );

  return (
    <div>
      <select
        value={selectedBranch}
        onChange={(e) =>
          setSelectedBranch(e.target.value)
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

      <table>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.branch}</td>
              <td>{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchFilter;