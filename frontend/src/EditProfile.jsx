import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, CreditCard, User, Settings } from "lucide-react";
import axios from "axios";
import "./Dashboard.css";
import "./Account.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "Derrick",
    lastName: "Fisher",
    email: "derrick@example.com",
    password: "mySecret123",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser((prev) => ({
        ...prev,
        ...storedUser,
        password: "" // don't show password in form
      }));
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const res = await axios.put(
        `http://localhost:8080/api/users/${storedUser.id}`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      console.log("Updated user data:", res.data);
      navigate("/account");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
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
              <Settings className="icon" /> Settings
            </Link>
          </li>
        </ul>
      </aside>

      <div className="main">
        <header className="header"></header>

        <main className="content">
          <div className="content-box">
            <h1 className="account-title">Edit Profile</h1>

            <div className="account-card">
              {[
                { label: "First Name", key: "firstName" },
                { label: "Last Name", key: "lastName" },
                { label: "Email", key: "email" },
                { label: "Password", key: "password" },
                { label: "Phone Number", key: "phoneNumber" },
                { label: "Address", key: "address" },
                { label: "City", key: "city" },
                { label: "Postal Code", key: "postalCode" },
                { label: "Country", key: "country" },
              ].map((field) => (
                <div className="account-field" key={field.key}>
                  <label>{field.label}:</label>
                  <input
                    type={field.key === "password" ? "password" : "text"}
                    name={field.key}
                    value={user[field.key] || ""}
                    onChange={handleChange}
                    className="edit-input"
                    required={["firstName", "lastName", "email", "password"].includes(field.key)}
                  />
                </div>
              ))}

              <button className="edit-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
