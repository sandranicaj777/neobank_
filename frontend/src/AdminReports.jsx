import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminReports() {
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        await axios.get("http://localhost:8080/api/admin/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // We don't store report here since it's not displayed in UI
      } catch (err) {
        console.error("Error fetching report", err);
      }
    };

    fetchReport();
  }, [token]);

  const exportFullReport = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/reports/export",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // ensures file download works
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "admin_report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const exportUserReport = async () => {
    if (!userId) {
      alert("Please enter a User ID");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/reports/user/${userId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `user_${userId}_report.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("User report export failed", err);
    }
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
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button className="export-btn" onClick={exportUserReport}>
            Export User Report
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
