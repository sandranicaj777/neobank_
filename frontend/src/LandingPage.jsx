import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <img src="/logo.png" alt="Neo Bank Logo" className="landing-logo" />

      <h1 className="landing-title">
        The future of <span>neutral, online banking</span> is here.
      </h1>

      <button className="get-started-btn" onClick={() => navigate("/login")}>
        Get Started 
      </button>

      <img src="/moneybag.png" alt="Money Bag" className="money-bag" />
    </>
  );
}