import { useState } from "react";

const PeriodToggle = ({ data = [] }) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState("Weekly");

  const filteredData = data.filter(
    (item) => item.period === selectedPeriod
  );

  return (
    <div>
      <button
        onClick={() => setSelectedPeriod("Weekly")}
      >
        Weekly
      </button>

      <button
        onClick={() => setSelectedPeriod("Monthly")}
      >
        Monthly
      </button>

      <button
        onClick={() => setSelectedPeriod("Yearly")}
      >
        Yearly
      </button>

      <p>Selected Period: {selectedPeriod}</p>

      <table>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.period}</td>
              <td>{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeriodToggle;