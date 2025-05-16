
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useCart } from "../Components/CartContext";
import "../CSS/Productdetails.css";
import "remixicon/fonts/remixicon.css";
import DeliveryInfo from "../Components/DeliveryInfo";
import showToast from "../Components/showToast";  
import StarRating from "../Components/StarRating";

import img57 from "../Assets/image 57.png";
import img58 from "../Assets/image 58.png";
import img59 from "../Assets/image 59.png";
import img61 from "../Assets/image 61.png";
import img63 from "../Assets/image 63.png";
import img611 from "../Assets/Frame 611.png";
import img612 from "../Assets/Frame 612.png";
import img610 from "../Assets/Frame 610.png";
import img613 from "../Assets/Frame 613.png";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 4,
    totalItems: 0,
    totalPages: 1
  });
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost/backend/getProduct.php?id=${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.category) {
      fetchRelatedProducts(pagination.currentPage);
    }
  }, [product, pagination.currentPage]);

  const fetchRelatedProducts = async (page) => {
    setLoadingRelated(true);
    try {
      const response = await fetch(
        `http://localhost/backend/getRelatedProducts.php?category=${product.category}&exclude_id=${id}&page=${page}&limit=${pagination.itemsPerPage}`
      );
      const data = await response.json();
      
      setRelatedProducts(data.products || []);
      setPagination(prev => ({
        ...prev,
        totalItems: data.totalItems || 0,
        totalPages: Math.ceil((data.totalItems || 0) / pagination.itemsPerPage)
      }));
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

 const handleAddToCart = async () => {
  if (product) {
    // Get the quantity from the input field
    const quantityInput = document.querySelector('.spin');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    //check stock availability
    try {
      // Fetch current product stock from backend
      const stockCheckResponse = await fetch(`http://localhost/backend/checkQuantity.php?product_id=${product.id}`);
      const stockResult = await stockCheckResponse.json();
      
      if (!stockCheckResponse.ok || !stockResult.success) {
        throw new Error('Failed to check product stock');
      }
      
      const availableStock = stockResult.stock;
      
      if (quantity > availableStock) {
        showToast({
          message: `Only ${availableStock} items available in stock!`,
          type: 'error'
        });
        return; // Exit the function if not enough stock
      }
      
      // Proceed with adding to cart since stock is available
      const cartItem = {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image_url,
        subtotal: product.price * quantity
      };
      
      // Send to PHP backend
      const response = await fetch('http://localhost/backend/addToCart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem)
      });

      const result = await response.json();
      
      if (result.success) {
        // Also add to local cart context
        addToCart(cartItem);
        showToast({
          message: 'Item added to cart!',
          type: 'success'
        });
      } else {
        showToast({
          message: result.message || 'Error adding to cart!',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      showToast({
        message: 'Error processing your request. Please try again.',
        type: 'error'
      });
    }
  }
};
 

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  if (!product) return <div className="Ntf">Product not found.</div>;

  return (
    <div>
      <div className="main">
        
        <div className="image1">
           <img src={img57} alt="" />
         </div>
         <div className="image2">
           <img src={img58} alt="" />
         </div>
         <div className="image3">
           <img src={img59} alt="" />
         </div>
         <div className="image4">
           <img src={img61} alt="" />
         </div>
         <div className="image5">
           <img src={img63} alt="" />
         </div>

         <div className="discription">
           <h3>{product.name}</h3>
           <span className="head"></span>
           <StarRating initialRating={4} reviewCount={150} />
           <h4>{product.price}</h4>
           <p>
             {product.description}
           </p>

           <div className="color-choice-container">
  <span className="choice-label">Colour:</span>
  
  <div className="radio-option">
    <input 
      id="red" 
      type="radio" 
      name="color-choose" 
      className="color-radio"
    />
    <label htmlFor="red" className="radio-label">
      <span className="radio-button"></span>
      <span className="radio-text">Red</span>
    </label>
  </div>
  
  <div className="radio-option">
    <input 
      id="blue" 
      type="radio" 
      name="color-choose" 
      className="color-radio"
    />
    <label htmlFor="blue" className="radio-label">
      <span className="radio-button"></span>
      <span className="radio-text">Blue</span>
    </label>
  </div>
</div>
           {product.category === 'clothes' && (
        <div className="size">
          <label htmlFor="">Size:</label>
          <input className="space" type="button" value="XS" />
          <input className="space" type="button" value="S" />
          <input className="space" type="button" value="M" />
          <input className="space" type="button" value="L" />
          <input className="space" type="button" value="XL" />
        </div>
      )}
           <input className="spin" type="number" min="1" max="20" required />
           <button 
             className="addcart"
             id="addcart"
             type="submit"
            
             onClick={handleAddToCart}
           >Add to Cart</button>

           <DeliveryInfo />
         </div>
        <div className="items-details">
          <h4 className="related">Related items</h4>

          {loadingRelated ? (
            <div className="loading-related">
              <div className="loading-spinner-small"></div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <div className="item" key={relatedProduct.id}>
                    <img 
                      src={relatedProduct.image_url || 'default-product-image.jpg'} 
                      alt={relatedProduct.name} 
                    />
                    <div 
                      className="add-to-cart"
                      onClick={() => handleAddToCart(relatedProduct)}
                    >
                      Add to Cart
                    </div>

                    <i className="ri-heart-3-line love"></i>
                    <i className="ri-eye-line eye"></i>

                    <div className="content">
                      <p>{relatedProduct.name}</p>
                      <h5>
                        {relatedProduct.price} ETB
                        {relatedProduct.original_price && (
                          <del>${relatedProduct.original_price} ETB</del>
                        )}
                      </h5>
                      <StarRating initialRating={4} reviewCount={130} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="pagination-controls">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={pagination.currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No related products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;