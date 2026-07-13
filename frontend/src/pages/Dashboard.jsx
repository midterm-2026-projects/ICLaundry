import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>

      <Link to="/orders">
        <button>Orders</button>
      </Link>
    </>
  );
};

export default Dashboard;
