import React from "react";
import "./css/Subscription.css";
import { khaltiApi, subscribeApi } from "../apis/Api";

const Subscription = () => {
  const handleSubscription = () => {
    khaltiApi()
      .then((res) => {
        window.location.href = res.data.payment_url; // Send to khalti
        subscribeApi()
          .then((res) => {})
          .catch((error) => {}); // Error handling
        const user = JSON.parse(localStorage.getItem("user")) || {};
        user.isPaid = true; // Update subscription status
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((error) => {});
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
