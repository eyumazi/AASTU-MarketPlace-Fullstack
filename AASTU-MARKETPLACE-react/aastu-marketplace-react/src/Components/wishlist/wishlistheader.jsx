import React from "react";
import "../../CSS/Wishlist.css";

const WishlistHeader = () => {
  return (
    <div className="container-1">
      <div className="headermin">
        <span className="title">Wishlist(19)</span>
      </div>
      <button className="view-all-btn">Move All To Items</button>
    </div>
  );
};

export default WishlistHeader;
