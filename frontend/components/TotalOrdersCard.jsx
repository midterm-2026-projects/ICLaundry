const TotalOrdersCard = ({
  value = 0,
}) => {
  return (
    <div className="analytics-kpi-card orders">
      <div className="analytics-kpi-icon"><ShoppingBag size={21} /></div>
      <h2>Total Orders</h2>
      <p>{value}</p>
      <span>Transaction records</span>
    </div>
  );
};

export default TotalOrdersCard;
import { ShoppingBag } from "lucide-react";
