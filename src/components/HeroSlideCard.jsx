import React from "react";
import "./css/HeroSlideCard.css";

const HeroSlideCard = ({ item }) => {
  return (
    <div className="hero-slide-card">
      <div className="hero-slide-card-img-container">
        <img
          src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${item.imageUrl}`}
          alt={item.title}
          className="hero-slide-card-img"
        />
      </div>
      <div className="hero-slide-card-details">
        <h4 className="hero-slide-card-title">{item.title}</h4>
        <p className="hero-slide-card-artist">{item.artist}</p>
      </div>
    </div>
  );
};

export default HeroSlideCard;
