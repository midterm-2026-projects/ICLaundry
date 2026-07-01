const DEFAULT_ALERTS = [
  {
    id: 1,
    type: "critical",
    title: "Out of Stock",
    description:
      "Drip-dry concentrate — 1 unit has been out of stock since yesterday.",
    actionLabel: "Restock Now",
  },
  {
    id: 2,
    type: "warning",
    title: "Restock Needed",
    description:
      "Washing detergent (Powder) at 3% stock (40 units). Consider restocking soon.",
    actionLabel: "Restock Now",
  },
  {
    id: 3,
    type: "warning",
    title: "Bleach Powder Running Out",
    description:
      "Based on usage trends, bleach powder will run out in ~2 days. Buy more to avoid shortage.",
    actionLabel: "View Predictions",
  },
  {
    id: 4,
    type: "info",
    title: "3 Orders Ready for Pickup",
    description:
      "Send email notifications to customers about their completed laundry. Don't keep them waiting!",
    actionLabel: "Send Notifications",
  },
];

export default DEFAULT_ALERTS;