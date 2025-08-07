import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Home,
  CreditCard,
  User,
  Settings,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Search,
} from "lucide-react";
import "./Dashboard.css";
import "./Transactions.css";
import "./LightMode.css"; // ✅ Import for light mode

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // ✅ Track theme

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Theme setup
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDarkMode(false);
  }, []);

  // Fetch transactions from backend
  useEffect(() => {
    if (!user || !token) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/transactions/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const mappedTransactions = res.data.map((tx) => ({
          ...tx,
          icon:
            tx.type === "DEPOSIT" ? (
              <ArrowDownLeft className="tx-icon deposit" />
            ) : tx.type === "WITHDRAWAL" ? (
              <ArrowUpRight className="tx-icon withdrawal" />
            ) : (
              <Send className="tx-icon transfer" />
            ),
          date: new Date(tx.timestamp).toLocaleString(),
        }));

        setTransactions(mappedTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, token]);

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const dto = {
        userId: user.id,
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        description: `${type} of $${amount}`,
        recipientId: type === "Transfer" ? parseInt(recipientId) : null,
      };

      const res = await axios.post(
        "http://localhost:8080/api/transactions",
        dto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newTx = {
        ...res.data,
        icon:
          res.data.type === "DEPOSIT" ? (
            <ArrowDownLeft className="tx-icon deposit" />
          ) : res.data.type === "WITHDRAWAL" ? (
            <ArrowUpRight className="tx-icon withdrawal" />
          ) : (
            <Send className="tx-icon transfer" />
          ),
        date: new Date(res.data.timestamp).toLocaleString(),
      };

      setTransactions([newTx, ...transactions]);
      setShowModal(false);
      setAmount("");
      setRecipientId("");
      setType("Deposit");
    } catch (err) {
      console.error("Transaction failed", err);
      alert(err.response?.data || "Transaction failed");
    }
  };

  return (
    <div className={`dashboard ${darkMode ? "" : "light-mode"}`}>
      <aside className="sidebar">
        <img
          src={darkMode ? "/logo.png" : "/darkModeLogo.png"}
          alt="NeoBank Logo"
          className="sidebar-logo-img"
        />
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard">
              <Home className="icon" /> Overview
            </Link>
          </li>
          <li className="active">
            <Link to="/transactions">
              <CreditCard className="icon" /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/account">
              <User className="icon" /> Account
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <Settings className="icon" /> Settings
            </Link>
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

                <button className="new-tx-btn" onClick={() => setShowModal(true)}>
                  + New Transaction
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading transactions...</p>
            ) : (
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
            )}
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
              <button className="modal-btn confirm" onClick={handleTransaction}>
                Submit
              </button>
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
