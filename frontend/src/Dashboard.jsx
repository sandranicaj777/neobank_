import { Link } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css";
import { Home, CreditCard, User, Settings, Bell, ArrowDownLeft, ArrowUpRight, Send } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [cardNumber, setCardNumber] = useState("2984 5633 7859 4141");
  const [cvc, setCvc] = useState("123"); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCardBack, setShowCardBack] = useState(false);

  const transactions = [
    { type: "Deposit", amount: 56.50, date: "28 Jul 2022, 21:40", icon: <ArrowDownLeft className="tx-icon deposit" /> },
    { type: "Deposit", amount: 2.50, date: "28 Jul 2022, 21:40", icon: <ArrowDownLeft className="tx-icon deposit" /> },
    { type: "Withdrawal", amount: 70.00, date: "28 Jul 2022, 21:40", icon: <ArrowUpRight className="tx-icon withdrawal" /> },
    { type: "Transfer", amount: 100.00, date: "28 Jul 2022, 21:40", icon: <Send className="tx-icon transfer" /> }
  ];

 
  const generateCardNumber = () => {
    let num = "";
    for (let i = 0; i < 16; i++) {
      num += Math.floor(Math.random() * 10);
      if ((i + 1) % 4 === 0 && i !== 15) num += " ";
    }
    return num;
  };

 
  const generateCVC = () => Math.floor(100 + Math.random() * 900).toString();


  const confirmNewCard = () => {
    setCardNumber(generateCardNumber());
    setCvc(generateCVC());
    setShowAddModal(false);
  };

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
            <Bell className="notif-icon" />
          </div>
        </header>


        <main className="content">
          <div className="content-box">
            <div className="dashboard-layout">

     
              <div className="left-side">

        
                <div className="transactions">
                  <h2>Recent Transactions</h2>
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

            
                <div className="virtualCards">
                  <h2 className="vcH2">Virtual Cards</h2>
                  <div className="cards-grid">

                    <div className="virtual-card" onClick={() => setShowCardBack(true)}>
                      <img src="/tx.png" alt="Card Chip" className="card-chip-img" />
                      <div className="card-number">{cardNumber}</div>
                      <div className="card-info">
                        <div>
                          <span className="label">CARD HOLDER</span>
                          <h4>Hello, user!</h4>
                        </div>
                        <img src="/mc.png" alt="Mastercard Logo" className="card-logo-img" />
                      </div>
                    </div>

                
                    <div className="virtual-card add-card" onClick={() => setShowAddModal(true)}>
                      <div className="plus-sign">+</div>
                      <p>Add New Card</p>
                    </div>
                  </div>
                </div>
              </div>

          
              <div className="right-side">
      
                <div className="chart-box">
                  <h2>Spent This Day</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={[
                        { day: "Sun", amount: 120 },
                        { day: "Mon", amount: 180 },
                        { day: "Tue", amount: 260 },
                        { day: "Wed", amount: 150 },
                        { day: "Thu", amount: 100 },
                        { day: "Fri", amount: 170 },
                        { day: "Sat", amount: 140 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="day" stroke="#aaa" />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#a78bfa" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

            
                <div className="available-cards">
                  <h2>Total balance:</h2>
                  <div className="card-summary">
                    <p><strong>98,500</strong> USD •••• 4141</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Generate a new virtual card?</h2>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={confirmNewCard}>Generate</button>
              <button className="modal-btn cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      
      {showCardBack && (
        <div className="modal-overlay" onClick={() => setShowCardBack(false)}>
          <div className="modal-card-back" onClick={(e) => e.stopPropagation()}>
            <div className="black-strip"></div>
            <div className="white-box">
              <span className="cvc-label">CVC</span>
              <span className="cvc-number">{cvc}</span>
            </div>
            <button className="modal-btn cancel" onClick={() => setShowCardBack(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
