import React from "react";
import fast from "../../Assets/fast-delivery.png";
import service from "../../Assets/24-hr-service.png";
import money from "../../Assets/money.png";

const ServiceHighlights = () => (
  <section className="key-aspect">
    <div>
      <img src={fast} alt="DELIVERY" />
      <h3>FREE AND FAST DELIVERY</h3>
      <p>Free delivery for all orders over $140</p>
    </div>
    <div>
      <img src={service} alt="SERVICE" />
      <h3>24/7 CUSTOMER SERVICE</h3>
      <p>Friendly 24/7 customer support</p>
    </div>
    <div>
      <img src={money} alt="money" />
      <h3>MONEY BACK GUARANTEE</h3>
      <p>We reTurn money within 30 days</p>
    </div>
  </section>
);

export default ServiceHighlights;
