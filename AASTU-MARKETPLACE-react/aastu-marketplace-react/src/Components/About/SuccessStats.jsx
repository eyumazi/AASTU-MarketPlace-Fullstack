import React from "react";
import serv from "../../Assets/Services.png";
import mon from "../../Assets/money.png";
import cust from "../../Assets/customer.png";
import monIcon from "../../Assets/moneyicon.png";

const SuccessStats = () => (
  <section className="service">
    <div className="box-1 box">
      <img src={serv} alt="services" />
      <h3>10.5k</h3>
      <p>Sallers active our site</p>
    </div>
    <div className="box-2 box">
      <img src={mon} alt="money" />
      <h3>33k</h3>
      <p>Monthly Produduct Sale</p>
    </div>
    <div className="box-3 box">
      <img src={cust} alt="customer" />
      <h3>45.5k</h3>
      <p>Customer active in our site</p>
    </div>
    <div className="box-4 box">
      <img src={monIcon} alt="money" />
      <h3>25k</h3>
      <p>Anual gross sale in our site</p>
    </div>
  </section>
);

export default SuccessStats;
