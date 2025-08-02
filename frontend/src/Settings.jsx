import { useState } from "react";
import "./Dashboard.css";
import "./Settings.css";
import { Home, CreditCard, User, Settings as SettingsIcon, Bell, Lock, BellRing, Shield, Cog } from "lucide-react";

export default function Settings() {
  const [showModal, setShowModal] = useState(false);

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
          <li>
            <User className="icon" /> Account
          </li>
          <li className="active">
            <SettingsIcon className="icon" /> Settings
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
                <button className="danger">Logout</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>

            <input type="password" placeholder="Old Password" />
            <input type="password" placeholder="New Password" />
            <input type="password" placeholder="Confirm New Password" />

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn save">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
