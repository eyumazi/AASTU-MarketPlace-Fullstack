

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "../CSS/Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [] } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    fname: "",
    companyName: "",
    address: "",
    apartFloor: "",
    city: "",
    phone: "",
    email: "",
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
    setPaymentError('');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.fname.trim()) newErrors.fname = "Full name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    
    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Phone number validation (basic)
    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    
    // Payment method validation
    if (!selectedPayment) {
      setPaymentError("Please select a payment method");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && selectedPayment;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const orderData = {
      customer_info: formData,
      payment_method: selectedPayment,
      cart_items: cartItems.map(item => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total_amount: calculateTotal(),
      order_date: new Date().toISOString()
    };
console.log(orderData);
    try {
      const response = await fetch("http://localhost/backend/placeOrder.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderDetails({
          orderId: data.order_id,
          total: data.total_amount,
          items: cartItems
        });
        setOrderSuccess(true);
       

      } else {
        setErrors(data.errors || { general: "Failed to place order" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "An error occurred while placing your order" });
    } finally {
      setLoading(false);
    }
  };

  
  const renderBreadcrumbs = () => (
        <div className="sub-nav">
          <a href="#" style={{ textDecoration: "none", color: "#aaa" }}>Account&ensp;</a>/
          <a href="#" style={{ textDecoration: "none", color: "#aaa" }}>My Account&ensp;</a>/
          <a href="#" style={{ textDecoration: "none", color: "#aaa" }}>Product&ensp;</a>/
          <a href="#" style={{ textDecoration: "none", color: "#aaa" }}>View Cart&ensp;</a>/
          <p style={{ display: "inline", color: "black" }}>&ensp;CheckOut</p>
        </div>
      );
    
      const renderBillingForm = () => (
        <div className="checkout" id="billing-form">
          <h2>Billing Details</h2>
          <form onSubmit={handleSubmit}>
            {[
              { id: "fname", label: "Full Name",  name: "fname" },
              { id: "Cname", label: "Company Name",  name: "companyName" },
              { id: "address", label: "Street Address",  name: "address" },
              { id: "Apartfloor", label: "Apartment, Floor, etc. (optional)",  name: "apartFloor" },
              { id: "city", label: "Town/city", name: "city" },
              { id: "phone", label: "Phone Number",  name: "phone", type: "tel" },
              { id: "email", label: "Email Address",  name: "email", type: "email" },
            ].map((field) => (
              <div className="form-info" key={field.id}>
                <label htmlFor={field.id}>
                  {field.label} {field.required && <sup>*</sup>}
                </label>
                <input
                  type={field.type || "text"}
                  id={field.id}
                  name={field.name}
                  value={formData[field.name]|| ""}
                  onChange={handleChange}
                />
                {errors[field.name] && <span className="error">{errors[field.name]}</span>}
              </div>
            ))}
    
            <div className="tick">
              <input type="checkbox" id="check" />
              <label htmlFor="check">Save this information for faster check-out next time</label>
            </div>
            
            <div className="order">
              <button type="submit">Place Order</button>
            </div>
            <div id="confirmation-message"></div>
          </form>
          
        </div>
      );
    
      const renderCartItems = () => {
        if (cartItems.length === 0) {
          return (
            <div className="empty-cart">
              <p></p>
            </div>
          );
        }
    
        return (
          <div>
            {cartItems.map((item) => (
              <div className="selected-items" key={item.id}>
                <div className="item items">
                  <img className="img1" src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                </div>
                <div className="items price">
                  <p>{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        );
      };
    
      const renderPaymentSection = () => {
        const paymentMethods = [
          { value: "bank", label: "Bank" },
          { value: "cash", label: "Cash on Delivery" },
          { value: "Telebirr", label: "Pay with Telebirr" },
          { value: "M-pessa", label: "Pay with M-PESSA" },
        ];
    
        return (
          <div className="total">
            <table>
              <tbody>
                <tr>
                  <td>Subtotal:</td>
                  <td>{calculateTotal()}</td>
                </tr>
                <tr>
                  <td>Shipping:</td>
                  <td>free</td>
                </tr>
                <tr>
                  <td>Total:</td>
                  <td>{calculateTotal()}</td>
                </tr>
              </tbody>
              
            </table>
    
            <div className="payment-method">
              {paymentMethods.map((method) => (
                <div key={method.value}>
                  <input
                    type="radio"
                    name="pay"
                    value={method.value}
                    onChange={handlePaymentChange}
                    checked={selectedPayment === method.value}
                  />
                  <label>{method.label}</label>
                </div>
              ))}
              {paymentError && <div className="error">{paymentError}</div>}
            </div>
          </div>
        );
      };
  if (orderSuccess) {
    return (
      <div className="order-success ">
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase.</p>
        <div className="order-details">
          <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
          <p><strong>Total:</strong> ${orderDetails.total.toFixed(2)}</p>
        </div>
        <button onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {renderBreadcrumbs()}
      <div className="checkout-container">
        <div className="checkout-form-container">
          {renderBillingForm()}
        </div>
        <div className="order-summary-container">
          {renderCartItems()}
          {renderPaymentSection()}
        </div>
      </div>
      {errors.general && <div className="error-message">{errors.general}</div>}
    </div>
  );
};

export default Checkout;