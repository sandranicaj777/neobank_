import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import { ArrowDownLeft, ArrowUpRight, Send } from "lucide-react";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/admin/recent-transactions?limit=50",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mapped = res.data.map((t) => ({
          id: t.id,
          type: t.type
            ? t.type.charAt(0).toUpperCase() + t.type.slice(1).toLowerCase()
            : "",
          amount: `$${Number(t.amount).toLocaleString()}`,
          user: t.user
            ? `${t.user.firstName || ""} ${t.user.lastName || ""}`.trim()
            : "Unknown User",
          date: t.timestamp
            ? new Date(t.timestamp).toLocaleString()
            : "No date available",
        }));

        setTransactions(mapped);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };

    fetchTransactions();
  }, [token]); 

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
      <div style={{ maxHeight: "800px", overflowY: "auto" }}>
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
      </div>
    </AdminLayout>
  );
}
