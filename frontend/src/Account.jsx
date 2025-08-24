import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Home,
  CreditCard,
  User,
  Settings as SettingsIcon,
  Bell,
  Coins,
} from "lucide-react";
import "./Dashboard.css";
import "./Account.css";
import "./LightMode.css";

export default function Account() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDarkMode(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

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
          <li>
            <Link to="/transactions">
              <CreditCard className="icon" /> Transactions
            </Link>
          </li>
          <li className="active">
            <Link to="/account">
              <User className="icon" /> Account
            </Link>
          </li>
          <li>
            <Link to="/crypto">
              <Coins className="icon" /> Crypto
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <SettingsIcon className="icon" /> Settings
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
            <h1 className="account-title">Welcome, {user.firstName}</h1>

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
                <p>{showPassword ? user.password || "No bueno :)" : "••••••••"}</p>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-btn"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="account-field">
                <label>Phone Number:</label>
                <p>{user.phoneNumber || "N/A"}</p>
              </div>

              <div className="account-field">
                <label>Address:</label>
                <p>{user.address || "N/A"}</p>
              </div>

              <div className="account-field">
                <label>City:</label>
                <p>{user.city || "N/A"}</p>
              </div>

              <div className="account-field">
                <label>Postal Code:</label>
                <p>{user.postalCode || "N/A"}</p>
              </div>

              <div className="account-field">
                <label>Country:</label>
                <p>{user.country || "N/A"}</p>
              </div>

              <div className="account-balance">
                <h3>Total Balance</h3>
                <div className="balance-display">
                  <CreditCard className="iconAccount" />
                  <p>{user.balance ?? "0.00"} USD</p>
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
