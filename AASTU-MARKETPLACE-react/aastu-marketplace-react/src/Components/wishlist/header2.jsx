import React from "react";
import "../../CSS/Wishlist.css";

const ThisMonthHeader = () => {
  return (
    <div className="container-1">
      <div className="headermin">
        <span className="indicator"></span>
        <span className="title">This Month</span>
      </div>
      <button className="view-all-btn">See All</button>
    </div>
  );
};

export default ThisMonthHeader;
