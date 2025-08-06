import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const openModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedUser(null);
  };

  const handleAction = async () => {
    if (!selectedUser) return;

    try {
      if (modalType === "freeze") {
        await axios.patch(
          `http://localhost:8080/api/users/${selectedUser.id}/freeze`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, status: "FROZEN" } : u
          )
        );
      } else if (modalType === "unfreeze") {
        await axios.patch(
          `http://localhost:8080/api/users/${selectedUser.id}/unfreeze`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, status: "ACTIVE" } : u
          )
        );
      } else if (modalType === "delete") {
        await axios.delete(
          `http://localhost:8080/api/users/${selectedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      }

      closeModal();
    } catch (err) {
      console.error("Error performing action", err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="textColor">Manage Users</h1>

      <div style={{ maxHeight: "700px", overflowY: "auto" }}>
        <table className="admin-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{`${u.firstName || ""} ${u.lastName || ""}`.trim()}</td>
                <td>{u.email}</td>
                <td>{u.status}</td>
                <td>
                  {u.status?.toUpperCase() === "ACTIVE" ? (
                    <button
                      className="action-btn"
                      onClick={() => openModal(u, "freeze")}
                    >
                      Freeze
                    </button>
                  ) : (
                    <button
                      className="action-btn"
                      onClick={() => openModal(u, "unfreeze")}
                    >
                      Unfreeze
                    </button>
                  )}
                  <button
                    className="action-btn danger-btn"
                    onClick={() => openModal(u, "delete")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {modalType === "freeze"
                ? `Freeze ${selectedUser.email}?`
                : modalType === "unfreeze"
                ? `Unfreeze ${selectedUser.email}?`
                : `Delete ${selectedUser.email}?`}
            </h2>
            <p>
              {modalType === "delete"
                ? "This action cannot be undone."
                : modalType === "freeze"
                ? "Are you sure you want to freeze this account?"
                : "Are you sure you want to unfreeze this account?"}
            </p>

            <div className="modal-actions">
              <button
                className={`action-btn ${
                  modalType === "delete" ? "danger-btn" : ""
                }`}
                onClick={handleAction}
              >
                {modalType === "delete"
                  ? "Delete"
                  : modalType === "freeze"
                  ? "Confirm Freeze"
                  : "Confirm Unfreeze"}
              </button>
              <button className="action-btn modal-close" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
