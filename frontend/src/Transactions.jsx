import { useState } from "react";
import "./Dashboard.css";
import "./Transactions.css";
import {
  Home,
  CreditCard,
  User,
  Settings,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Search
} from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([
    { type: "Deposit", amount: 56.5, date: "28 Jul 2022, 21:40", icon: <ArrowDownLeft className="tx-icon deposit" /> },
    { type: "Deposit", amount: 2.5, date: "28 Jul 2022, 21:40", icon: <ArrowDownLeft className="tx-icon deposit" /> },
    { type: "Withdrawal", amount: 70.0, date: "28 Jul 2022, 21:40", icon: <ArrowUpRight className="tx-icon withdrawal" /> },
    { type: "Transfer", amount: 100.0, date: "28 Jul 2022, 21:40", icon: <Send className="tx-icon transfer" /> }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");


  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if ((type === "Withdrawal" || type === "Transfer") && parseFloat(amount) > 1000) {
      alert("Insufficient balance!");
      return;
    }

    const newTx = {
      type,
      amount: parseFloat(amount),
      date: new Date().toLocaleString(),
      icon:
        type === "Deposit"
          ? <ArrowDownLeft className="tx-icon deposit" />
          : type === "Withdrawal"
          ? <ArrowUpRight className="tx-icon withdrawal" />
          : <Send className="tx-icon transfer" />
    };

    setTransactions([newTx, ...transactions]); 
    setShowModal(false);
    setAmount("");
    setRecipientId("");
    setType("Deposit");
  };

  return (
    <div className="dashboard">
  
      <aside className="sidebar">
        <img src="/logo.png" alt="NeoBank Logo" className="sidebar-logo-img" />
        <ul className="sidebar-menu">
          <li><Home className="icon" /> Overview</li>
          <li className="active"><CreditCard className="icon" /> Transactions</li>
          <li><User className="icon" /> Account</li>
          <li><Settings className="icon" /> Settings</li>
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

                <button className="new-tx-btn" onClick={() => setShowModal(true)}>
                  + New Transaction
                </button>
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

   
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">New Transaction</h2>

        
            <label className="modal-label">Type:</label>
            <div className="tx-type-buttons">
              <button
                className={`type-btn ${type === "Deposit" ? "active deposit" : ""}`}
                onClick={() => setType("Deposit")}
              >
                <ArrowDownLeft className="type-icon" /> Deposit
              </button>
              <button
                className={`type-btn ${type === "Withdrawal" ? "active withdrawal" : ""}`}
                onClick={() => setType("Withdrawal")}
              >
                <ArrowUpRight className="type-icon" /> Withdrawal
              </button>
              <button
                className={`type-btn ${type === "Transfer" ? "active transfer" : ""}`}
                onClick={() => setType("Transfer")}
              >
                <Send className="type-icon" /> Transfer
              </button>
            </div>

      
            <label className="modal-label">Amount:</label>
            <input
              type="number"
              className="modal-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />

          
            {type === "Transfer" && (
              <>
                <label className="modal-label">Recipient ID:</label>
                <input
                  type="text"
                  className="modal-input"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="Enter user ID"
                />
              </>
            )}

     
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={handleTransaction}>Submit</button>
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
