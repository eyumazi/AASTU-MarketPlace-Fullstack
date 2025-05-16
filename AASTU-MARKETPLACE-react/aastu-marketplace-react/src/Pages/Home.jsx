import "../CSS/Home.css";
import React, { useState } from "react";

import Banner from "../Components/home/banner";
import Sidebar from "../Components/home/sidebar";
import ItemSales from "../Components/home/item";
import PostModal from "../Components/home/Post";
import "..//CSS/Post.css";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home">
      <div className="home-upper">
        <Sidebar />
        <Banner />
      </div>
      <div className="home-content">
        <ItemSales />
        <Banner />
        <ItemSales />
        {/* Floating Post Button */}
        <button
          className="floating-post-btn"
          onClick={() => setShowModal(true)}
        >
          + Post
        </button>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <PostModal />
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
