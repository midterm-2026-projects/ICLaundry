const TotalRevenueCard = ({
  value = "₱0",
}) => {
  return (
    <div className="analytics-kpi-card revenue">
      <div className="analytics-kpi-icon"><DollarSign size={21} /></div>
      <h2>Total Revenue</h2>
      <p>{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value) || 0)}</p>
      <span>Collected payments</span>
    </div>
  );
};

export default TotalRevenueCard;
import { DollarSign } from "lucide-react";
