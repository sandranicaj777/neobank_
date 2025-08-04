import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState(""); 
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

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber
      });

      // ✅ Save token to localStorage
      localStorage.setItem("token", res.data.jwtToken);

      // ✅ (Optional) Save user info too
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Registration successful! Redirecting...");
      setError("");

      // ✅ Redirect immediately (or after 2 sec)
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      setError("Registration failed. Please try again.");
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
          <input 
            type="text" 
            className="register-input" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="register-label">Last Name</label>
          <input 
            type="text" 
            className="register-input" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="register-label">Email</label>
          <input 
            type="email" 
            className="register-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="register-label">Password</label>
          <input 
            type="password" 
            className="register-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="register-label">Repeat Password</label>
          <input 
            type="password" 
            className="register-input" 
            value={repeatPassword} 
            onChange={(e) => setRepeatPassword(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="register-label">Phone Number</label>
          <input 
            type="text" 
            className="register-input" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
        </div>

        <button type="submit" className="register-btn">Sign Up</button>

        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}

        <a href="/login" className="register-link">Already have an account? Log in</a>
      </form>
    </main>
  );
}
