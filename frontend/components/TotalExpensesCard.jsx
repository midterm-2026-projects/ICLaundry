const TotalExpensesCard = ({
  value = "₱0",
}) => {
  return (
    <div className="analytics-kpi-card expenses">
      <div className="analytics-kpi-icon"><Wallet size={21} /></div>
      <h2>Total Expenses</h2>
      <p>{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value) || 0)}</p>
      <span>Inventory restocking</span>
    </div>
  );
};

export default TotalExpensesCard;
import { Wallet } from "lucide-react";
