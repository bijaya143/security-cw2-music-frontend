// Unauthorized.js
import React from "react";
import "../css/Unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">403</h1>
      <p className="unauthorized-message">
        You do not have permission to view this page.
      </p>
      <a href="/" className="unauthorized-button">
        Go to Homepage
      </a>
    </div>
  );
};

export default Unauthorized;
