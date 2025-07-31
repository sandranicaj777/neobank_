import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([
    { type: "Deposit", amount: 56.50, date: "Today" },
    { type: "Withdrawal", amount: 70.00, date: "Yesterday" },
    { type: "Deposit", amount: 100.00, date: "2 days ago" }
  ]);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-logo">NeoBank</h2>
        <ul className="sidebar-menu">
          <li className="active">🏠 Overview</li>
          <li>💳 Payments</li>
          <li>👤 Account</li>
          <li>⚙️ Settings</li>
        </ul>
      </aside>

      
      <main className="main-content">
        <h1 className="page-title">Overview</h1>

        <div className="chart-box">
          <h3>Spending Overview</h3>
          <div className="chart-placeholder">📊 Chart Coming Soon</div>
        </div>

        <div className="transactions-box">
          <h3>Recent Transactions</h3>
          <ul className="transactions-list">
            {transactions.map((t, i) => (
              <li key={i}>
                <span className="type">{t.type}</span>
                <span className="amount">${t.amount.toFixed(2)}</span>
                <span className="date">{t.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <aside className="right-panel">
        <div className="card-box">
          <h3>Available Cards</h3>
          <div className="card">
            <p className="card-type">💳 Virtual Card</p>
            <p className="card-number">**** **** **** 1234</p>
            <p className="card-balance">$5,240.00</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
