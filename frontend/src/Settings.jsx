import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import "./Settings.css";
import { Home, CreditCard, User, Settings as SettingsIcon, Bell, Lock, BellRing, Shield, Cog } from "lucide-react";

export default function Settings() {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:8080/auth/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );      
      setMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to change password. Please check your old password.");
    }
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
          <div className="content-box settings-box">
            <div className="settings-section">
              <h3><Lock className="section-icon" /> Security</h3>
              <button className="settings-btn" onClick={() => setShowModal(true)}>Change Password</button>
              <label className="toggle">
                <input type="checkbox" />
                <span className="slider"></span> Enable 2FA
              </label>
            </div>

            <div className="settings-section">
              <h3><BellRing className="section-icon" /> Notifications</h3>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span> Email Alerts
              </label>
              <label className="toggle">
                <input type="checkbox" />
                <span className="slider"></span> SMS Alerts
              </label>
            </div>

            <div className="settings-section">
              <h3><Cog className="section-icon" /> Preferences</h3>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span> Dark Mode
              </label>
            </div>

            <div className="settings-section">
              <h3><Shield className="section-icon" /> Privacy</h3>
              <button className="settings-btn">Download My Data</button>
              <div>
                <button className="danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {message && <p style={{ marginTop: "10px", color: "white" }}>{message}</p>}

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn save" onClick={handlePasswordChange}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
