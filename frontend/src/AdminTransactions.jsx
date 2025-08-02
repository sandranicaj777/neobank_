import AdminLayout from "./AdminLayout";
import { ArrowDownLeft, ArrowUpRight, Send } from "lucide-react";

export default function AdminTransactions() {
  const transactions = [
    { id: 1, type: "Deposit", amount: "$500", user: "John Doe", date: "2025-07-01" },
    { id: 2, type: "Withdrawal", amount: "$200", user: "Jane Smith", date: "2025-07-02" },
    { id: 3, type: "Transfer", amount: "$300", user: "Alice Johnson", date: "2025-07-03" },
  ];

  // helper to return correct class for text color
  const getTypeClass = (type) => {
    switch (type) {
      case "Deposit":
        return "type-deposit";
      case "Withdrawal":
        return "type-withdrawal";
      case "Transfer":
        return "type-transfer";
      default:
        return "";
    }
  };

  // helper to return correct icon
  const getIcon = (type) => {
    switch (type) {
      case "Deposit":
        return <ArrowDownLeft className="tx-icon deposit-icon" />;
      case "Withdrawal":
        return <ArrowUpRight className="tx-icon withdrawal-icon" />;
      case "Transfer":
        return <Send className="tx-icon transfer-icon" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <h1 className="textColor">Transactions</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.user}</td>
              <td className={getTypeClass(t.type)}>
                <span className="type-cell">
                  {getIcon(t.type)}
                  {t.type}
                </span>
              </td>
              <td>{t.amount}</td>
              <td>{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
