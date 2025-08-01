import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("register-body");
    return () => {
      document.body.classList.remove("register-body");
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
      });
      setSuccess("✅ Registration successful! You can now log in.");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("❌ Registration failed. Please try again.");
      setSuccess("");
      console.error(err);
    }
  };

  return (
    <main className="register-container">
      <img className="register-logo" src="/logo.png" alt="Neo Bank Logo" />
      <form onSubmit={handleRegister} className="register-form">
        <div>
          <label className="register-label">First Name</label>
          <input type="text" className="register-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div>
          <label className="register-label">Last Name</label>
          <input type="text" className="register-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div>
          <label className="register-label">Email</label>
          <input type="email" className="register-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="register-label">Password</label>
          <input type="password" className="register-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div>
          <label className="register-label">Phone Number</label>
          <input type="text" className="register-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        <div>
          <label className="register-label">Address</label>
          <input type="text" className="register-input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <button type="submit" className="register-btn">Sign Up</button>

        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}

        <a href="/login" className="register-link">Already have an account? Log in</a>
      </form>
    </main>
  );
}
