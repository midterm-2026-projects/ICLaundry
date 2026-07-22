import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Staff from "./pages/Staff";

import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/orders" element={<Orders />} />

      <Route path="/customers" element={<Customers />} />

      <Route path="/staff" element={<Staff />} />
    </Routes>
  );
}

export default App;
