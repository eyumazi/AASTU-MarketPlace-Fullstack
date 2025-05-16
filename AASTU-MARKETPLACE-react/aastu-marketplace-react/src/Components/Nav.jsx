import React, { useState } from "react";
import "../CSS/Nav-style.css";
import DropdownMenu from "./DropdownMenu";
import searchIcon from "../Assets/Search button.png";
import wishlistIcon from "../Assets/Wishlist.png";
import cartIcon from "../Assets/Cart1.png";
import userIcon from "../Assets/user.png";
import { Link } from "react-router-dom";

const Nav = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };
  return (
    <div>
      <title>AASTUMarketPlace</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Team 1 Section B AASTU students" />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/Assets/favicon.png" type="image/x-icon" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Sora:wght@100..800&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <header>
        <div className="heading">
          <p className="heading-text">
            Find every kind of product or sell what you’ve got.
            <a href="#">Shop Now</a> OR <a href="#">Sell Your Product</a>
          </p>
        </div>
        <nav>
          <h1 className="heading_1">AASTU Marketplace</h1>
          <ul className="navigation">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/contacus">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="What are you looking for?"
            />
            <button className="search-btn">
              <img src={searchIcon} alt="Search Icon" className="search-icon" />
            </button>
          </div>
          <div className="btns">
            <Link to="/wishlist">
              <img src={wishlistIcon} alt="Go to Wishlist" />

            </Link>
            <a href="/Cart Page/index.html">
              <Link to="/cart">
                {" "}
                <img src={cartIcon} alt="View Cart" />
              </Link>
            </a>

            <div
              className="dropdown-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "relative" }}
            >
              <Link to="/profile">
                <img src={userIcon} alt="Account Settings" />
              </Link>
              {isDropdownVisible && (
                <div style={{ zIndex: 1000 }}>
                  <DropdownMenu />
                </div>
              )}
            </div>
          </div>
        </nav>
        <div className="bottom-line" />
      </header>
      <div className="a" />
    </div>
  );
};

export default Nav;
