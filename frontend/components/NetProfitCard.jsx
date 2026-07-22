const NetProfitCard = ({
  value = "₱0",
}) => {
  return (
    <div className="analytics-kpi-card profit">
      <div className="analytics-kpi-icon"><Percent size={21} /></div>
      <h2>Net Profit</h2>
      <p>{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value) || 0)}</p>
      <span>Revenue less expenses</span>
    </div>
  );
};

export default NetProfitCard;
import { Percent } from "lucide-react";
