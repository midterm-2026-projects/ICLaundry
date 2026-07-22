// frontend/src/pages/Dashboard.jsx

import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        gap-6
        bg-gray-100
      "
    >
      <h1
        className="
          text-4xl
          font-bold
        "
      >
        Dashboard
      </h1>

      <div
        className="
          flex
          flex-wrap
          gap-4
        "
      >
        <Link to="/orders">
          <button
            className="
              rounded-lg
              bg-blue-600
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Orders
          </button>
        </Link>

        <Link to="/customers">
          <button
            className="
              rounded-lg
              bg-green-600
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-green-700
            "
          >
            Customers
          </button>
        </Link>

        <Link to="/staff">
          <button
            className="
              rounded-lg
              bg-purple-600
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-purple-700
            "
          >
            Staff
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
