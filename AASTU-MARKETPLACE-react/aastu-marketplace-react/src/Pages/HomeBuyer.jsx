import "../CSS/Home.css";
import Banner from "../Components/home/banner";
import Sidebar from "../Components/home/sidebar";
import ItemSales from "../Components/home/item";
import "../CSS/Post.css";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";

const HomeBuyer = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        // Fetch featured items from your backend
        const response = await fetch("http://localhost/backend/items.php");
        const data = await response.json();

        if (response.ok) {
          setFeaturedItems(data);
        } else {
          console.error("Failed to fetch featured items:", data.error);
        }
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading featured items...</p>
    </div>
  );

  return (
    <div className="home">
      <div className="home-upper">
        <Sidebar />
        <Banner />
      </div>
      <div className="home-content">
        {/* First featured item with link */}
        {featuredItems.length > 0 && (
          <Link to={`/productdetails/${featuredItems[0]?.id}`}>
            <div className="featured-item-wrapper">
              <ItemSales items={[featuredItems[0]]} /> {/* Pass single item as array */}
            </div>
          </Link>
        )}
        
        <Banner />
        
        {/* Second featured item with link */}
        {featuredItems.length > 1 && (
          <Link to={`/productdetails/${featuredItems[1]?.id}`}>
            <div className="featured-item-wrapper">
              <ItemSales items={[featuredItems[1]]} /> {/* Pass single item as array */}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeBuyer;