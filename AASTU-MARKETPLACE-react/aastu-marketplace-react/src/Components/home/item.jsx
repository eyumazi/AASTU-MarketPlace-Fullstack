import React, { useEffect, useState } from "react";
import heart from "../../Assets/heart.svg";
import eye from "../../Assets/eye.svg";
import profile from "../../Assets/Profile.png";

const ItemSales = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("itemdetail")
        .select("*")
        .order("itemId", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setItems(data);
      }
    };

    fetchItems();
  }, []);

  return (
    <section className="item-sales">
      {items.map((item) => (
        <div className="item-card" key={item.itemId}>
          <div className="item-upper">
            <div className="item-image">
              <div className="icons">
                <span className="icon-heart">
                  <img src={heart} alt="Heart Icon" />
                </span>
                <span className="icon-eye">
                  <img src={eye} alt="Eye Icon" />
                </span>
              </div>
              <img
                className="item-img"
                src={`http://localhost/aastu-marketplace/uploads/${item.itemProfile}`}
                alt="product"
              />
            </div>
          </div>
          <div className="item-detail">
            <img src={profile} alt="customer-profile" width={50} height={50} />
            <div className="customer-profile">
              <div className="profile">
                <h5>{item.itemName}</h5>
                <p>AASTU Electronics</p>
                <div className="rating">{item.itemRate}</div>
              </div>
              <p>{item.itemPrice} ETB</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ItemSales;
