import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Staff from "./pages/Staff";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/orders" element={<Orders />} />

      <Route path="/staff" element={<Staff />} />
    </Routes>
  );
}

export default App;
