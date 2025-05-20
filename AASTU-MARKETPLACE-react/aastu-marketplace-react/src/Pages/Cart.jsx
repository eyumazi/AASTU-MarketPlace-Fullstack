import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Cart.css";
import img613 from "../Assets/Frame 613.png";
import img611 from "../Assets/Frame 611.png";
import { useCart } from '../Components/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateCartItem } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cartData, setCartData] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch cart items from backend when component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost/backend/getCart.php');
                const data = await response.json();
                if (data.success) {
                    setCartData(data.items);
                    calculateTotal(data.items);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // Calculate total whenever cartData changes
    useEffect(() => {
        calculateTotal(cartData);
    }, [cartData]);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(sum);
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            // Update in backend
            const response = await fetch('http://localhost/backend/updateCart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: newQuantity
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Update in local state
                const updatedCart = cartData.map(item => 
                    item.product_id === productId 
                        ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
                        : item
                );
                setCartData(updatedCart);
                updateCartItem(productId);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            // Remove from backend
            const response = await fetch('http://localhost/backend/removeFromCart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId })
            });

            const result = await response.json();
            
            if (result.success) {
                // Remove from local state
                setCartData(cartData.filter(item => item.product_id !== productId));
                removeFromCart(productId);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleProceedToCheckout = () => {
       
        navigate('/checkout', { state: { cartItems: cartData } });
    };

    const handleUpdateCart = async () => {
        try {
            const response = await fetch('http://localhost/backend/updateCart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartData)
            });
            const result = await response.json();
            if (result.success) {
               
                showToast({
          message: 'Cart updated successfully!',
          type: 'success'
        });
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    if (loading) {
        return <div className="loading-container">
        <div className="loading-spinner"></div>
        Loading cart...</div>;
    }

    return (
        <div>
            <div className="sub-nav">
                <a style={{textDecoration: "none", color: "#aaa"}} href="#">Home&ensp;</a>/
                <p style={{display: "inline", color: "black"}}>&ensp;Cart</p>
            </div>

            {cartData.length === 0 ? (
                <div className="empty-cart">
                    <p>No items in cart.</p>
                    <Link to="/products">
                        <button className="shop-button">Continue Shopping</button>
                    </Link>
                </div>
            ) : (
                <>
                    <section className="products">
                        <div className="product-list prolist" id="product-list">
                            <div className="product"><p>Product</p></div>
                            <div className="price"><p>Price</p></div>
                            <div className="quantity"><p>Quantity</p></div>
                            <div className="sub-total"><p>Subtotal</p></div>
                            <div className="action"><p>Action</p></div>
                        </div>
                        

                        <div className="product-list selected">
                            {cartData.map((item) => (
                                <div key={item.product_id} className="cart-item-row">
                                    <div className="item-row items" data-label="Product">
                                        <img className="img1" src={item.image} alt={item.name}/>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className="items" data-label="Price">
                                        <p>{item.price} ETB</p>
                                    </div>
                                    <div className="items" data-label="Quantity">
                                        <input 
                                            className="spin" 
                                            type="number" 
                                            min="1" 
                                            max="20" 
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="items" data-label="Subtotal">
                                        <p>{(item.price * item.quantity)}ETB</p>
                                    </div>
                                    <div className="items " data-label="Action">
                                        <button 
                                            onClick={() => handleRemoveItem(item.product_id)}
                                            className="remove-button"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="cart-buttons" id="cart-buttons">
                        <div className="return button">
                            <Link to="/products" >
                                <input type="button" value="Return to Shop"/>
                            </Link>
                        </div>
                        <div className="update button">
                            <input 
                                type="button" 
                                value="Update Cart"
                                onClick={handleUpdateCart}
                            />
                        </div>

                        <div className="cart-total" id="cart-total">
                            <h6>Cart Total</h6>
                            <div className="data">
                                <p>Subtotal:</p>
                                <p>{total} ETB</p>
                            </div>
                            <div className="data">
                                <p>Shipping:</p>
                                <p>Free</p>
                            </div>
                            <div className="data" id="total">
                                <p>Total:</p>
                                <p>{total} ETB</p>
                            </div>
                            <div className="Checkout" id="Checkout">
                                <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;


