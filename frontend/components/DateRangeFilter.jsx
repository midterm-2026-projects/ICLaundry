import { useState } from "react";

const DateRangeFilter = () => {
  const [startDate, setStartDate] =
    useState("");
  const [endDate, setEndDate] =
    useState("");

  let result = "Displaying all records";

  if (startDate && endDate) {
    result = `Displaying records from ${startDate} to ${endDate}`;
  }

  return (
    <div>
      <label htmlFor="startDate">
        Start Date
      </label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
      />

      <label htmlFor="endDate">
        End Date
      </label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
      />

      <p>
        Start:{" "}
        {startDate || "No date selected"}
      </p>

      <p>
        End: {endDate || "No date selected"}
      </p>

      <p>{result}</p>
    </div>
  );
};

export default DateRangeFilter;