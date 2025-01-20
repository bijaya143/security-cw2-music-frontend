import React from "react";
import { NavLink } from "react-router-dom";
import "./css/AdminSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faMusic,
  faUser,
  faLifeRing,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className="profile">
        <h3 className="profile-name">Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" activeClassName="active">
              <FontAwesomeIcon
                icon={faTachometerAlt}
                className="sidebar-icon"
              />{" "}
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/customers" activeClassName="active">
              <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />{" "}
              Customers
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/songs" activeClassName="active">
              <FontAwesomeIcon icon={faMusic} className="sidebar-icon" /> Songs
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/artists" activeClassName="active">
              <FontAwesomeIcon icon={faUser} className="sidebar-icon" /> Artists
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/genres" activeClassName="active">
              <FontAwesomeIcon icon={faLifeRing} className="sidebar-icon" />{" "}
              Genres
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
