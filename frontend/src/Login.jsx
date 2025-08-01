import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <main className="auth-container">
      <img className="logo" src="/logo.png" alt="Logo" />
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="btn">Log In</button>
        {error && <p className="error">{error}</p>}
        <a href="/register" className="forgot-password">Don’t have an account? Register</a>
      </form>
    </main>
  );
}
