// src/AdminLayout.jsx
import { Home, Users, CreditCard, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <img src="/logo.png" alt="NeoBank Logo" className="admin-logo" />

        <ul className="admin-menu">
          <li>
            <Link to="/admin">
              <Home className="icon" /> Overview
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <Users className="icon" /> Users
            </Link>
          </li>
          <li>
            <Link to="/admin/transactions">
              <CreditCard className="icon" /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/admin/reports">
              <FileText className="icon" /> Reports
            </Link>
          </li>
        </ul>
      </aside>

      <div className="admin-main">{children}</div>
    </div>
  );
}
