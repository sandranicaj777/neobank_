import "./Dashboard.css";   // ✅ Reuse sidebar + general dashboard styles
import "./Transactions.css"; // ✅ Only extra styling for transactions page
import { Home, CreditCard, User, Settings, Bell, ArrowDownLeft, ArrowUpRight, Send, Search } from "lucide-react";

export default function Transactions() {
  const transactions = [
    { type: "Deposit", amount: 56.50, date: "28 Jul 2022, 21:40", icon: <ArrowDownLeft className="tx-icon deposit" /> },
    { type: "Deposit", amount: 2.50, date: "28 Jul 2022, 21:40", icon: <ArrowDownLeft className="tx-icon deposit" /> },
    { type: "Withdrawal", amount: 70.00, date: "28 Jul 2022, 21:40", icon: <ArrowUpRight className="tx-icon withdrawal" /> },
    { type: "Transfer", amount: 100.00, date: "28 Jul 2022, 21:40", icon: <Send className="tx-icon transfer" /> }
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <img src="/logo.png" alt="NeoBank Logo" className="sidebar-logo-img" />
        <ul className="sidebar-menu">
          <li>
            <Home className="icon" /> Overview
          </li>
          <li className="active">
            <CreditCard className="icon" /> Transactions
          </li>
          <li>
            <User className="icon" /> Account
          </li>
          <li>
            <Settings className="icon" /> Settings
          </li>
        </ul>
      </aside>

      <div className="main">
        <header className="header">
          <div className="header-right">
            <Bell className="notif-icon" />
          </div>
        </header>

        <main className="content">
          <div className="content-box">
            <div className="transactions-header">
              <h2>Transactions</h2>
              <div className="transactions-controls">
                <select className="transactions-filter">
                  <option value="all">All</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="transfer">Transfers</option>
                </select>

                <div className="search-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="transactions-search"
                    placeholder="Search transactions..."
                  />
                </div>
              </div>
            </div>

            <div className="transactions-list">
              {transactions.map((tx, index) => (
                <div key={index} className="transaction-row">
                  <div className="tx-left">
                    {tx.icon}
                    <div className="tx-details">
                      <span className="tx-type">{tx.type}</span>
                      <span className="tx-date">{tx.date}</span>
                    </div>
                  </div>
                  <div className="tx-right">
                    <span className="tx-amount">${tx.amount.toFixed(2)}</span>
                    <span className="tx-menu">⋯</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
