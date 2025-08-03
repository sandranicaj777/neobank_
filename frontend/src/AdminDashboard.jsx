
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 class="textColor">Welcome, Admin!</h1>
      <p>Overview of the system.</p>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>1,024</p>
        </div>
        <div className="stat-card">
          <h3>Total Balance</h3>
          <p>$4,500,000</p>
        </div>
        <div className="stat-card">
          <h3>Recent Transactions</h3>
          <p>320 Today</p>
        </div>
      </div>
    </AdminLayout>
  );
}
