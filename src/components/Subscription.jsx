import React from "react";
import "./css/Subscription.css";

const Subscription = () => {
  const handleSubscription = () => {
    // Logic to handle payment and update user subscription status
    const user = JSON.parse(localStorage.getItem("user")) || {};
    user.isPaid = true; // Update subscription status
    localStorage.setItem("user", JSON.stringify(user));
    alert("Subscription successful! Enjoy your content.");
  };

  return (
    <div className="subscription-page">
      <h1>Subscribe Now</h1>
      <p>Unlock all content with a one-time subscription.</p>
      <button className="subscribe-button" onClick={handleSubscription}>
        Subscribe for Rs. 100
      </button>
    </div>
  );
};

export default Subscription;
