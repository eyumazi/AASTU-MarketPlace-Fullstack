import React from "react";
import heart from "../../Assets/heart.svg";
import eye from "../../Assets/eye.svg";
import profile from "../../Assets/Profile.png";

const ItemSales = ({ items = [] }) => {
  return (
    <section className="item-sales">
      {items.map((item) => (
        <div className="item-card" key={item.id}>
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
                src={item.image}
                alt={item.name}
              />
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