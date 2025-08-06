import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  CreditCard,
  User,
  Settings,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [balance, setBalance] = useState(0);

  const [cards, setCards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCardBack, setShowCardBack] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [cvc, setCvc] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch everything on load
  useEffect(() => {
    if (!user || !token) return;

    // Notifications
    fetch("http://localhost:8080/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      })
      .catch((err) => console.error("Error fetching notifications:", err));

    // Transactions
    fetch(`http://localhost:8080/api/transactions/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((tx) => ({
            ...tx,
            date: tx.timestamp
              ? new Date(tx.timestamp).toLocaleString()
              : "No date available",
            timestampValue: tx.timestamp ? new Date(tx.timestamp).getTime() : 0,
          }))
          .sort((a, b) => b.timestampValue - a.timestampValue);

        setTransactions(sorted.slice(0, 4));

        const today = new Date().toISOString().split("T")[0];
        const todaysSpending = sorted.filter((tx) => {
          const txDate = tx.timestamp
            ? new Date(tx.timestamp).toISOString().split("T")[0]
            : "";
          return (
            txDate === today &&
            (tx.type?.toUpperCase() === "WITHDRAWAL" ||
              tx.type?.toUpperCase() === "TRANSFER")
          );
        });

        const chartPoints = todaysSpending
          .map((tx) => ({
            time: new Date(tx.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount: Number(tx.amount),
          }))
          .sort((a, b) =>
            new Date(`1970/01/01 ${a.time}`) -
            new Date(`1970/01/01 ${b.time}`)
          );

        setChartData(chartPoints);
      })
      .catch((err) => console.error("Error fetching transactions:", err));

    // Balance
    fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.balance === "number") {
          setBalance(data.balance);
        }
      })
      .catch((err) => console.error("Error fetching balance:", err));

    // Cards
    fetch("http://localhost:8080/api/cards", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Error fetching cards:", err));
  }, [token, user]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadCount > 0) {
      notifications.forEach((n) => {
        if (!n.read) {
          fetch(`http://localhost:8080/api/notifications/${n.id}/read`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const confirmNewCard = () => {
    fetch("http://localhost:8080/api/cards", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((newCard) => {
        setCards((prev) => [...prev, newCard]);
        setShowAddModal(false);
      })
      .catch((err) => console.error("Error creating card:", err));
  };

  const cardColors = [
    "linear-gradient(135deg, #3c1053, #ad5389)",
    "linear-gradient(135deg, #1e3c72, #a78bfa)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <img src="/logo.png" alt="NeoBank Logo" className="sidebar-logo-img" />
        <ul className="sidebar-menu">
          <li className="active">
            <Link to="/dashboard">
              <Home className="icon" /> Overview
            </Link>
          </li>
          <li>
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
            <div className="notification-wrapper" onClick={handleBellClick}>
              <Bell className="notif-icon" />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </div>

            {showNotifications && (
              <div className="notifications-dropdown">
                {notifications.length === 0 ? (
                  <p className="no-notifications">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${
                        n.read ? "read" : ""
                      }`}
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </header>

        <main className="content">
          <div className="content-box">
            <div className="dashboard-layout">
              <div className="left-side">
                {/* Transactions */}
                <div className="transactions">
                  <h2>
                    Recent Transactions{" "}
                    <Link
                      to="/transactions"
                      style={{
                        float: "right",
                        fontSize: "0.9rem",
                        color: "#a78bfa",
                      }}
                    >
                      View All
                    </Link>
                  </h2>
                  <div className="transactions-list">
                    {transactions.map((tx, index) => (
                      <div key={index} className="transaction-row">
                        <div className="tx-left">
                          {tx.type?.toLowerCase() === "deposit" && (
                            <ArrowDownLeft className="tx-icon deposit" />
                          )}
                          {tx.type?.toLowerCase() === "withdrawal" && (
                            <ArrowUpRight className="tx-icon withdrawal" />
                          )}
                          {tx.type?.toLowerCase() === "transfer" && (
                            <Send className="tx-icon transfer" />
                          )}
                          <div className="tx-details">
                            <span className="tx-type">{tx.type}</span>
                            <span className="tx-date">{tx.date}</span>
                          </div>
                        </div>
                        <div className="tx-right">
                          <span className="tx-amount">
                            ${Number(tx.amount).toLocaleString()}
                          </span>
                          <span className="tx-menu">⋯</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Virtual Cards */}
                <div className="virtualCards">
                  <h2 className="vcH2">Virtual Cards</h2>
                  <div className="cards-carousel">
                    {cards.map((card, index) => (
                      <div
                        key={card.id}
                        className="virtual-card"
                        style={{
                          background: cardColors[index % cardColors.length],
                        }}
                        onClick={() => {
                          setCvc(card.cvv);
                          setSelectedCardIndex(index);
                          setShowCardBack(true);
                        }}
                      >
                        <img
                          src="/tx.png"
                          alt="Card Chip"
                          className="card-chip-img"
                        />
                        <div className="card-number">
                          {card.cardNumber.match(/.{1,4}/g).join(" ")}
                        </div>
                        <div className="card-info">
                          <div>
                            <span className="label">CARD HOLDER</span>
                            <h4>
                              {user?.firstName + " " + user?.lastName}
                            </h4>
                            <span>
                              Expires:{" "}
                              {new Date(card.expiryDate).toLocaleDateString(
                                "en-US",
                                { month: "2-digit", year: "2-digit" }
                              )}
                            </span>
                          </div>
                          <img
                            src="/mc.png"
                            alt="Mastercard Logo"
                            className="card-logo-img"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add New Card */}
                    <div
                      className="virtual-card add-card"
                      onClick={() => setShowAddModal(true)}
                    >
                      <div className="plus-sign">+</div>
                      <p>Add New Card</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart & Balance */}
              <div className="right-side">
                <div className="chart-box">
                  <h2>Spent This Day</h2>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#2a2a2a"
                        />
                        <XAxis dataKey="time" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#222",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#a78bfa"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-placeholder">
                      No spending today
                    </div>
                  )}
                </div>

                <div className="available-cards">
                  <h2>Total balance:</h2>
                  <div className="card-summary">
                    <p>
                      <strong>
                        {typeof balance === "number"
                          ? balance.toLocaleString()
                          : 0}
                      </strong>{" "}
                      USD •••• 4141
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Generate a new virtual card?</h2>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={confirmNewCard}>
                Generate
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Back Modal */}
      {showCardBack && (
        <div className="modal-overlay" onClick={() => setShowCardBack(false)}>
          <div
            className="modal-card-back"
            style={{
              background: cardColors[selectedCardIndex % cardColors.length],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="black-strip" style={{ borderRadius: 0 }}></div>
            <div className="white-box">
              <span className="cvc-label">CVC</span>
              <span className="cvc-number">{cvc}</span>
            </div>
            <button
              className="modal-btn cancel"
              onClick={() => setShowCardBack(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
