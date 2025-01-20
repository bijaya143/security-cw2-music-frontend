import React from "react";
import "./css/Footer.css"; // Import the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      {/* <div className="footer-content">
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>
            We are a company dedicated to providing the best service and
            products to our customers. Our mission is to enhance your experience
            with top-quality solutions.
          </p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
          </ul>
        </div>
        <div className="footer-section newsletter">
          <h2>Newsletter</h2>
          <p>Subscribe to our newsletter to get the latest updates.</p>
          <form>
            <input type="email" placeholder="Your Email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div> */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Harmonica. All rights reserved.</p>
        <div className="socials">
          <a href="https://facebook.com">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
