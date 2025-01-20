import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/SubscriptionSuccess.css";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/"); // Redirect to the homepage
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="success-title">Purchase Successful!</h2>
        <p className="success-message">
          Thank you for subscribing! You now have full access to all premium
          content.
        </p>
        <button className="btn btn-primary" onClick={handleRedirect}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
