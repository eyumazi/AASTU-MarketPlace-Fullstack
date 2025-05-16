import React from "react";
import image from "../../Assets/SideImage.png";

const StorySection = () => (
  <section className="story">
    <div className="left">
      <h1 className="our-story">Our Story</h1>
      <p className="main-para">
        Welcome to the AASTU E-commerce Platform, a project proudly developed by
        passionate third-year students of Section B, Group 1 at Addis Ababa
        Science and Technology University (AASTU). Our team is dedicated to
        providing a tailored solution that connects students within the AASTU
        community, making buying and selling products easier than ever. Our
        platform is designed specifically for AASTU students to foster a
        thriving marketplace within the campus. Sellers can conveniently upload
        and showcase their products, while buyers can effortlessly browse,
        explore, and purchase items they need. By focusing exclusively on AASTU,
        we aim to create a secure, supportive, and user-friendly environment
        where students can engage in hassle-free transactions.
      </p>
      <p className="second-para">
        Driven by innovation and a commitment to solving real-world problems,
        this project represents not only our technical skills but also our
        vision to make life easier for our peers. Thank you for supporting our
        initiative, and we look forward to seeing the AASTU community grow
        stronger through this platform.Exclusive has more than 1 Million
        products to offer, growing at a very fast. Exclusive offers a diverse
        assotment in categories ranging from consumer.Exclusive has 10,500
        sallers and 300 brands and serves 3 millions customers across the
        region.
      </p>
    </div>
    <div className="right">
      <img src={image} alt="hero-about" />
    </div>
  </section>
);

export default StorySection;
