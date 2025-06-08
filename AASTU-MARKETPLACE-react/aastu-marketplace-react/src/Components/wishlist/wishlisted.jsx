import React, { useEffect, useState } from "react";
import profile from "../../Assets/Profile.png";
import "../../CSS/wishlisted.css";

const WishlistedItems = () => {
  const [wishlist, setWishlist] = useState([]);
  const userId = "ETS0514V15"; // Replace with real auth ID

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `http://localhost/AASTU-MarketPlace-Fullstack/AASTU-MARKETPLACE-react/backend/get_wishlist.php?user_id=${userId}`
        );

        const data = await res.json();

        if (res.ok) {
          setWishlist(data);
        } else {
          console.error("Error loading wishlist:", data.error);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <section className="wishlist-items">
      {wishlist.map((item) => (
        <div className="wishlist-item" key={item.itemid}>
          <div className="wishlist-item-image-container">
            <img
              src={item.itemprofile}
              width={200}
              height={150}
              alt="product image"
              className="wishlist-item-image"
            />
            <button
              className="remove-button"
              aria-label="Remove from wishlist"
              onClick={async () => {
                try {
                  const res = await fetch(
                    "http://localhost/AASTU-MarketPlace-Fullstack/AASTU-MARKETPLACE-react/backend/delete_wishlist.php",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        user_id: userId,
                        item_id: item.itemid,
                      }),
                    }
                  );
                  const data = await res.json();
                  if (res.ok && data.success) {
                    setWishlist((prev) =>
                      prev.filter((w) => w.itemid !== item.itemid)
                    );
                  } else {
                    console.error("Delete failed:", data.error);
                  }
                } catch (err) {
                  console.error("Network error while deleting:", err);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          <div className="item-detail">
            <img src={profile} alt="customer-profile" width={50} height={50} />
            <div className="customer-profile">
              <div className="profile">
                <h5>{item.itemname}</h5>
                <p>AASTU Electronics</p>
                <div className="rating">{item.itemrate}</div>
              </div>
              <p>{item.itemprice} ETB</p>
            </div>
          </div>
          <button className="add-to-cart-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add To Cart
          </button>
        </div>
      ))}
    </section>
  );
};

export default WishlistedItems;
