import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Fetch total balance
        const balanceRes = await axios.get("http://localhost:8080/admin/total-balance", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalBalance(balanceRes.data);

        // Fetch total users from /api/users
        const usersRes = await axios.get("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalUsers(usersRes.data.length);

        // Fetch recent transactions
        const txRes = await axios.get("http://localhost:8080/admin/recent-transactions?limit=5", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentTransactions(txRes.data);

      } catch (err) {
        console.error("Error fetching admin data", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <AdminLayout>
      <h1 className="textColor">Welcome, Admin!</h1>
      <p>Overview of the system.</p>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Balance</h3>
          <p>${Number(totalBalance).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Recent Transactions</h3>
          <p>{recentTransactions.length}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
