import { Home, Users, CreditCard, FileText, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("adminToken");

    
    navigate("/login");
  };

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

       
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut className="icon" /> Logout
        </button>
      </aside>

      <div className="admin-main">{children}</div>
    </div>
  );
}
