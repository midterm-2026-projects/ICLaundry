import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Staff from "./pages/Staff";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import SideNavigation from "../components/SideNavigation";

import "./index.css";

function App() {
  useEffect(() => { document.documentElement.classList.toggle("app-dark", localStorage.getItem("ic-dark-mode") === "true"); }, []);
  return (
    <div className="app-layout">
      <SideNavigation />
      <div className="app-content">
      <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/orders" element={<Orders />} />

      <Route path="/customers" element={<Customers />} />

      <Route path="/staff" element={<Staff />} />

      <Route path="/inventory" element={<Inventory />} />

      <Route path="/analytics" element={<Analytics />} />

      <Route path="/settings" element={<Settings />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
