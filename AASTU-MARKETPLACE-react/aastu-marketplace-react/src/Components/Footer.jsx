import React from "react";
import playstoreIcon from "../Assets/Frame 719.png";
import facebookIcon from "../Assets/Icon-Facebook.png";
import twitterIcon from "../Assets/Icon-X.png";
import instagramIcon from "../Assets/icon-instagram.png";
import linkedinIcon from "../Assets/Icon-Linkedin.png";
import { Link } from "react-router-dom";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="support-container">
        <h2>Support</h2>
        <h3>
          Addis Ababa, Koyefeche,
          <br />
          Addis Ababa Science
          <br />
          and Technology University
        </h3>
        <h3>AASTUMarketPlace@gmail.com</h3>
        <h3>+251 934 556 789</h3>
      </div>
      <div className="account-container">
        <h2>Account</h2>
        <h3>
          <a href="/Log in Page/login.html">Login</a> /
          <a href="/Sign up page/signup.html">Register</a>
        </h3>
        <h3>
          <Link to ="/cart">Cart</Link>
        </h3>
        <h3>
          <a href="/WishList Page/wishlist.html">Wishlist</a>
        </h3>
      </div>
      <div className="quick-link">
        <h2>Quick Link</h2>
        <h3>
          <a href="/About Page/About_us.html">About us</a>
        </h3>
        <h3>
          <Link to="/contacus">Contact Us</Link>
        </h3>
        <h3>
          <a href="/Sign up page/signup.html">Sale Product</a>
        </h3>
      </div>
      <div className="download-img">
        <h2>Download App</h2>
        <h3>Save $3 with App New User Only</h3>
        <a href="#">
          <img
            className="playstore"
            height="65px"
            src={playstoreIcon}
            alt="App download link"
          />
        </a>
        <div className="contacts">
          <a href="https://facebook.com" aria-label="Visit our Facebook page">
            <img src={facebookIcon} alt="Facebook Icon" />
          </a>
          <a href="https://twitter.com" aria-label="Visit our Twitter page">
            <img src={twitterIcon} alt="Twitter Icon" />
          </a>
          <a href="https://instagram.com" aria-label="Visit our Instagram page">
            <img src={instagramIcon} alt="Instagram Icon" />
          </a>
          <a href="https://linkedin.com" aria-label="Visit our LinkedIn page">
            <img src={linkedinIcon} alt="LinkedIn Icon" />
          </a>
        </div>
      </div>
      <pre>
        <span>&copy;</span> {currentYear} AASTU Marketplace. All rights
        reserved.
      </pre>
    </footer>
  );
};

export default Footer;
