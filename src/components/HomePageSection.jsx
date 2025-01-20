import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/HomePageSection.css";
import SongCard from "./SongCard";

const HomePageSection = ({ title, items, type }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isPaid = user?.isPaid ?? false;

  const handleLockedClick = () => {
    navigate("/subscribe"); // Redirect to the subscription page if locked
  };

  return (
    <div className="section">
      <h3 className="section-title">{title}</h3>
      <div className="d-flex flex-row bd-highlight scroll-list">
        {items.length > 0 ? (
          items.slice(0, 10).map((item, index) => (
            <div key={index}>
              {isPaid ? (
                <Link
                  to={`/${type}/${item._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <SongCard item={item} type={type} />
                </Link>
              ) : (
                <div onClick={handleLockedClick}>
                  <SongCard item={item} type={type} />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No {title.toLowerCase()} available.</p>
        )}
      </div>
      <Link
        to={`/${title.toLowerCase().replace(" ", "-")}`}
        style={{ textDecoration: "none" }}
      >
        <p className="text-end fs-6">See More...</p>
      </Link>
    </div>
  );
};

export default HomePageSection;
