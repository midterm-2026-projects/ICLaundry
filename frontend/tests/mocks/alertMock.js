export const mockAlert = {
  id: 1,
  type: "critical",
  title: "Out of Stock",
  description: "Out of stock description",
  actionLabel: "Restock Now",
};

export const mockAlerts = [
  mockAlert,
  {
    id: 2,
    type: "warning",
    title: "Restock Needed",
    description: "Restock warning description",
    actionLabel: "Restock Now",
  },
  {
    id: 3,
    type: "info",
    title: "Orders Ready",
    description: "Three orders are ready for pickup.",
    actionLabel: "Send Notifications",
  },
];