import React from "react";
import heart from "../../Assets/heart.svg";
import heartFilled from "../../Assets/heartFilled.svg"; // Add this image
import eye from "../../Assets/eye.svg";
import profile from "../../Assets/Profile.png";


const ItemSales = ({ items = [] }) => {

  const [items, setItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]); // Track liked items
  const userId = "ETS0514V15";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "http://localhost/AASTU-MarketPlace-Fullstack/AASTU-MARKETPLACE-react/backend/items.php"
        );
        const data = await response.json();
        if (response.ok) {
          setItems(data);
        } else {
          console.error("Failed to fetch items:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchItems();
  }, []);

  const handleLike = async (itemId) => {
    try {
      const res = await fetch(
        "http://localhost/AASTU-MarketPlace-Fullstack/AASTU-MARKETPLACE-react/backend/like.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, item_id: itemId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setLikedItems(
          (prev) =>
            prev.includes(itemId)
              ? prev.filter((id) => id !== itemId) // Toggle off
              : [...prev, itemId] // Toggle on
        );
        console.log("Toggled like:", itemId);
      } else {
        console.error("Like failed:", data.error);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleWishlist = async (itemId) => {
    try {
      const res = await fetch(
        "http://localhost/AASTU-MarketPlace-Fullstack/AASTU-MARKETPLACE-react/backend/wishlist.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, item_id: itemId }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Wishlist failed:", data.error);
      } else {
        console.log("Added to wishlist:", itemId);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };


  return (
    <section className="item-sales">
      {items.map((item) => (
        <div className="item-card" key={item.id}>
          <div className="item-upper">
            <div className="item-image">
              <div className="icons">
                <span
                  className="icon-heart"
                  onClick={() => handleLike(item.itemid)}
                  title="Like"
                >
                  <img
                    src={likedItems.includes(item.itemid) ? heartFilled : heart}
                    alt="Heart Icon"
                  />
                </span>
                <span
                  className="icon-eye"
                  onClick={() => handleWishlist(item.itemid)}
                  title="Add to Wishlist"
                >
                  <img src={eye} alt="Eye Icon" />
                </span>
              </div>

              <img
                className="item-img"
                src={item.image}
                alt={item.name}
              />

              <img className="item-img" src={item.itemprofile} alt="product" />

            </div>
          </div>
          <div className="item-detail">
            <img src={profile} alt="customer-profile" width={50} height={50} />
            <div className="customer-profile">
              <div className="profile">
                <h5>{item.name}</h5>
                <p>{item.category}</p>
                <div className="rating">{item.itemrate}</div>
              </div>
              <p>{item.price} ETB</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ItemSales;