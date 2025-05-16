import React from "react";
import logo from "../../Assets/Apple-logo.png";
import iphone from "../../Assets/iphone.png";
const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <img id="appleLogo" src={logo} alt="Apple Logo" className="logo" />
        <h2 id="text1">iPhone 14 Series</h2>
        <p id="text2">Up to 10% off Voucher</p>
        <a href="/Sign up page/signup.html" className="shop-now">
          Shop Now →
        </a>
        <div className="dots">
          <span id="1">
            <span id="2" className="active">
              <span id="3"></span>
            </span>
          </span>
        </div>
      </div>
      <img src={iphone} alt="iPhone 14" className="banner-image" />
    </div>
  );
};

export default Banner;
