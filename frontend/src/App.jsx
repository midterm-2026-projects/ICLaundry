import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Staff from "./pages/Staff";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";

import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/orders" element={<Orders />} />

      <Route path="/customers" element={<Customers />} />

      <Route path="/staff" element={<Staff />} />

      <Route path="/inventory" element={<Inventory />} />

      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default App;
