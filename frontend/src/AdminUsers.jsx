import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Frozen" },
  ];

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

  return (
    <AdminLayout>
      <h1 className="textColor">Manage Users</h1>
      <table className="admin-table">
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
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => openModal(u, "freeze")}
                >
                  Freeze
                </button>
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


      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {modalType === "freeze"
                ? `Freeze ${selectedUser.name}?`
                : `Delete ${selectedUser.name}?`}
            </h2>
            <p>
              {modalType === "delete"
                ? "This action cannot be undone."
                : "Are you sure you want to freeze this account?"}
            </p>

            <div className="modal-actions">
              <button
                className={`action-btn ${
                  modalType === "delete" ? "danger-btn" : ""
                }`}
              >
                {modalType === "delete" ? "Delete" : "Confirm"}
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
