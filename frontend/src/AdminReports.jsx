import AdminLayout from "./AdminLayout";

export default function AdminReports() {

  const exportFullReport = () => {
    alert("Full report export will be connected to backend later!");
  };

  const exportUserReport = () => {
    alert("User-specific report export will be connected later!");
  };

  return (
    <AdminLayout>
      <h1 className="textColor1">Reports</h1>

      <div className="report-header">
        <h3>System Overview</h3>
        <button className="export-btn" onClick={exportFullReport}>
          Export Full Report
        </button>
      </div>

      <hr className="divider" />

  
      <div className="user-export-card">
        <h3>Export Reports for a Specific User</h3>
        <div className="user-export">
          <input
            type="text"
            placeholder="Enter User ID"
          />
          <button className="export-btn" onClick={exportUserReport}>
            Export User Report
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
