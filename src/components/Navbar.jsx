import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [keyword, setKeyword] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      navigate(`/search?keyword=${keyword}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src="/assets/images/sangeet_logo_new.png"
            alt="Logo"
            width="150"
            height="35"
            className="d-inline-block align-text-top"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex ms-auto me-auto w-50" role="search">
            <input
              className="form-control me-2 rounded-pill"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </form>
          <form className="d-flex" role="search">
            {!user ? (
              <>
                <Link
                  to={"/login"}
                  className="btn btn-outline-success m-1"
                  type="submit"
                >
                  Login
                </Link>
                <Link
                  to={"/register"}
                  className="btn btn-outline-primary m-1"
                  type="submit"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Welcome {user.firstName}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
