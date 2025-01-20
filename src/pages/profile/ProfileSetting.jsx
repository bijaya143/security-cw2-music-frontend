import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileSetting = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Profile Settings
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <ul className="list-group">
              <Link
                to="/profile"
                style={{ textDecoration: "none" }}
                onClick={() => handleLinkClick("/profile")}
              >
                <li
                  className={`list-group-item${
                    activeLink === "/profile"
                      ? " active list-group-item-secondary"
                      : ""
                  }`}
                  aria-current={activeLink === "/profile" ? "true" : undefined}
                >
                  Account
                </li>
              </Link>
              <Link
                to="/change-password"
                style={{ textDecoration: "none" }}
                onClick={() => handleLinkClick("/change-password")}
              >
                <li
                  className={`list-group-item${
                    activeLink === "/change-password"
                      ? " active list-group-item-secondary"
                      : ""
                  }`}
                  aria-current={
                    activeLink === "/change-password" ? "true" : undefined
                  }
                >
                  Change Password
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
