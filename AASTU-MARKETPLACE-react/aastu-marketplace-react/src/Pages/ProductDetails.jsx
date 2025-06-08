
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
import SizeSelector from "../Components/SizeSelector";
import { Carousel } from 'react-responsive-carousel';
const ProductDetails = () => {
  const { id } = useParams();
  console.log('Product ID from URL:', id);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
   const [quantity, setQuantity] = useState(1);
   const [selectedColor, setSelectedColor] = useState('red');
  const [selectedSize, setSelectedSize] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 4,
    totalItems: 0,
    totalPages: 1
  });
  const [loadingRelated, setLoadingRelated] = useState(false);
 let productImages = [];

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(2000, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) {
      console.error('Product ID is missing');
      setLoading(false);
      return;
    }
      try {
        const response = await fetch(`http://localhost/backend/getProduct.php?id=${id}`);
        const data = await response.json();
        console.log('Fetched product:', data);
        setProduct(data.product || null);
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
        quantity:quantity,
        image: product.image,
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
      
      

     console.log('Adding to cart:', cartItem);

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
      // show full error details in console
     console.error('Full error details:', error);
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
    <div className="product-detail-container">
      <div className="product-main-section">
        {/* Product Images Carousel */}
        <div className="product-images-carousel">
          <div className="product-main-section">
  <div className="product-image-container">
    <img 
      src={`http://localhost/backend/uploads/${product.image}`}
      alt={`${product.name}`} 
      className="product-main-image"
    />
  </div>
</div>
</div>
            

        {/* Product Information */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
            <StarRating initialRating={4} reviewCount={150} />
            <a href="#reviews" className="review-link">(150 reviews)</a>
          </div>

          <div className="product-price">
            <span className="current-price">{product.price} ETB</span>
            {product.original_price && (
              <span className="original-price">{product.original_price} ETB</span>
            )}
            {product.discount && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {/* Color Selection */}
          <div className="product-option-section">
            <h3 className="option-title">Color:</h3>
            <div className="color-options">
              {['red', 'blue'].map(color => (
                <div key={color} className="color-option">
                  <input
                    type="radio"
                    id={color}
                    name="color"
                    checked={selectedColor === color}
                    onChange={() => setSelectedColor(color)}
                  />
                  <label htmlFor={color} className={`color-label ${color}`}>
                    <span className="color-name">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Size Selection (only for clothes) */}
          {product.category === 'clothes' && (
            <div className="product-option-section">
              <h3 className="option-title">Size:</h3>
              <SizeSelector 
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <h3 className="option-title">Quantity:</h3>
            <div className="quantity-controls">
              
              <input
                type="number"
                min="1"
                max="2000"
               
                
                className="spin"
              />
             
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            className="add-to-cart-btn"
            onClick={() => handleAddToCart({...product, quantity})}
          >
            <i className="ri-shopping-cart-line"></i> Add to Cart
          </button>

          {/* Delivery Information */}
          <DeliveryInfo />
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products-section">
        <h2 className="section-title">Related Products</h2>
        
        {loadingRelated ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : relatedProducts.length > 0 ? (
          <>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div className="related-product-card" key={relatedProduct.id}>
                  <div className="product-image-container">
                    <img 
                      src={`http://localhost/backend/uploads/${relatedProduct.image}`}
                      alt={relatedProduct.name}
                      className="related-product-image"
                    />
                    <div className="product-actions">
                      <button className="wishlist-btn">
                        <i className="ri-heart-3-line"></i>
                      </button>
                      <button 
                        className="quick-view-btn"
                        onClick={() => console.log("Quick view", relatedProduct.id)}
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button 
                        className="quick-add-btn"
                        onClick={() => handleAddToCart({...relatedProduct, quantity: 1})}
                      >
                        <i className="ri-shopping-cart-line"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{relatedProduct.name}</h3>
                    <div className="price">
                      <span className="current-price">{relatedProduct.price} ETB</span>
                      {relatedProduct.original_price && (
                        <span className="original-price">{relatedProduct.original_price} ETB</span>
                      )}
                    </div>
                    <StarRating initialRating={4} reviewCount={130} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  className={`pagination-btn ${pagination.currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <i className="ri-arrow-left-s-line"></i> Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${pagination.currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  className={`pagination-btn ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="no-products-message">No related products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;