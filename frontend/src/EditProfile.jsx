import { useState } from "react";
import { Home, CreditCard, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
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


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const handleSave = () => {
    console.log("Updated user data:", user);
    // ✅ Here you’d send a PUT request to your backend endpoint
    // fetch(`/api/users/${user.id}`, { method: "PUT", body: JSON.stringify(user) })

    navigate("/account"); 
  };

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
          <li className="active">
            <User className="icon" /> Account
          </li>
          <li>
            <Settings className="icon" /> Settings
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
                    value={user[field.key]}
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
