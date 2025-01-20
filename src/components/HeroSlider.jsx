import React from "react";
import Slider from "react-slick";
import HeroSlideCard from "./HeroSlideCard";
import "./css/HeroSlider.css";
import { Link, useNavigate } from "react-router-dom";

const HeroSlider = ({ items }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isPaid = user?.isPaid ?? false;

  const handleLockedClick = () => {
    navigate("/subscribe"); // Redirect to the subscription page if locked
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "60px",
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
          <div key={index} className="slider-item">
            {/* Conditionally render the Link or a div */}
            {isPaid ? (
              <Link to={`/song/${item._id}`}>
                <HeroSlideCard item={item} />
              </Link>
            ) : (
              <div onClick={handleLockedClick}>
                <HeroSlideCard item={item} />
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
