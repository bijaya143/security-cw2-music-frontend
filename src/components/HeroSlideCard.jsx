import React from "react";
import "./css/HeroSlideCard.css";

const HeroSlideCard = ({ item }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isPaid = user?.isPaid ?? false; // Fallback to false if attribute doesn't exist

  return (
    <div className="hero-slide-card">
      <div className="hero-slide-card-img-container">
        <img
          src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${item.imageUrl}`}
          alt={item.title}
          className="hero-slide-card-img"
        />
        {!isPaid && (
          <>
            {/* Overlay */}
            <div className="hero-slide-card-overlay">
              <i className="fa fa-lock hero-slide-card-lock-icon"></i>
              <p className="hero-slide-card-lock-message">Locked</p>
              <p className="hero-slide-card-subtext">Unlock Premium Access</p>
            </div>
            {/* Optional dim background */}
            <div className="hero-slide-card-dim"></div>
          </>
        )}
      </div>
      <div className="hero-slide-card-details">
        <h4 className="hero-slide-card-title">{item.title}</h4>
        <p className="hero-slide-card-artist">{item.artist}</p>
      </div>
    </div>
  );
};

export default HeroSlideCard;
