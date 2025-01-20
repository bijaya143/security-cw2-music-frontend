import React from "react";
import { Link } from "react-router-dom";
import "./css/HomePageSection.css";
import SongCard from "./SongCard";

const HomePageSection = ({ title, items, type }) => (
  <div className="section">
    <h3 className="section-title">{title}</h3>
    <div className="d-flex flex-row bd-highlight scroll-list">
      {items.length > 0 ? (
        items
          .slice(0, 10)
          .map((item, index) => (
            <SongCard key={index} item={item} type={type} />
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

export default HomePageSection;
