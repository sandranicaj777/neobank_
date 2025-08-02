import { useState } from "react";
import { Eye, EyeOff, Home, CreditCard, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";   
import "./Account.css";     

export default function Account() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const user = {
    firstName: "Derrick",
    lastName: "Fisher",
    email: "derrick@example.com",
    password: "••••••••",
    balance: "98,500 USD",
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <img src="/logo.png" alt="NeoBank Logo" className="sidebar-logo-img" />

        <ul className="sidebar-menu">
          <li>
            <Home className="icon" /> Overview
          </li>
          <li>
            <CreditCard className="icon" /> Transactions
          </li>
          <li className="active">
            <User className="icon" /> Account
          </li>
          <li>
            <Settings className="icon" /> Settings
          </li>
        </ul>
      </aside>


      <div className="main">
        <header className="header">
        </header>

        <main className="content">
          <div className="content-box">
            <h1 className="account-title">Welcome, {user.firstName} </h1>

            <div className="account-card">
              <div className="account-field">
                <label>First Name:</label>
                <p>{user.firstName}</p>
              </div>

              <div className="account-field">
                <label>Last Name:</label>
                <p>{user.lastName}</p>
              </div>

              <div className="account-field">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
              <div className="account-field password-field">
                <label>Password:</label>
                <p>{showPassword ? "mySecret123" : "••••••••"}</p>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-btn"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div className="account-field">
                <label>Phone Number:</label>
                <p>{user.phoneNumber}</p>
              </div>
              <div className="account-field">
                <label>Address:</label>
                <p>{user.address}</p>
              </div>
              <div className="account-field">
                <label>City:</label>
                <p>{user.city}</p>
              </div>
              <div className="account-field">
                <label>Postal Code:</label>
                <p>{user.postalCode}</p>
              </div>
              <div className="account-field">
                <label>Country:</label>
                <p>{user.country}</p>
              </div>

              

              <div className="account-balance">
                <h3>Total Balance</h3>
                <div className="balance-display">
  <CreditCard className="iconAccount" />
  <p>{user.balance}</p>
</div>

              </div>

              <button
                className="edit-btn"
                onClick={() => navigate("/edit-profile")}
              >
                 Edit Profile
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
