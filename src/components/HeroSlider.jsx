import React from "react";
import Slider from "react-slick";
import HeroSlideCard from "./HeroSlideCard";
import "./css/HeroSlider.css";
import { Link } from "react-router-dom";

const HeroSlider = ({ items }) => {
  const settings = {
    dots: false, // Dots are disabled
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "60px", // Increased padding to reveal the right card
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <div className="hero-slider">
      <h3 className="section-title">Crafted For You</h3>
      <Slider {...settings}>
        {items.slice(0, 5).map((item, index) => (
          <Link to={`/song/${item._id}`}>
            <div key={index} className="slider-item">
              <HeroSlideCard item={item} />
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
