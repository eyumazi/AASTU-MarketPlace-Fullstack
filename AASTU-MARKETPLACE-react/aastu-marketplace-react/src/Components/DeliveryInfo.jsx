import { useState } from 'react';
import React from 'react';
function DeliveryInfo() {
  const [showPostalCode, setShowPostalCode] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock function to check delivery availability
  const checkDeliveryAvailability = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    const isValid = /^\d{4}(-\d{4})?$/.test(postalCode); // Basic Ethiopian postal code pattern
    
    if (isValid) {
      setDeliveryMessage('Delivery available to your area!');
    } else {
      setDeliveryMessage('Sorry, we currently don\'t deliver to this area');
    }
    
    setIsLoading(false);
  };

  const handlePostalCodeSubmit = (e) => {
    e.preventDefault();
    if (postalCode.trim()) {
      checkDeliveryAvailability();
    }
  };

  return (
    <div className="delivery" id="delivery">
      <p>Free Delivery</p>
      <a 
        href="#" 
        id="check-delivery-link"
        onClick={(e) => {
          e.preventDefault();
          setShowPostalCode(!showPostalCode);
          setDeliveryMessage(''); // Clear previous message
        }}
      >
        {showPostalCode ? 'Hide delivery check' : 'Enter your postal code for delivery availability'}
      </a>
      
      {showPostalCode && (
        <div id="postal-code-container">
          <form onSubmit={handlePostalCodeSubmit}>
            <input
              type="text"
              id="postal-code"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <button 
              id="check-delivery-btn" 
              type="submit"
              disabled={isLoading || !postalCode.trim()}
            >
              {isLoading ? 'Checking...' : 'Check Delivery'}
            </button>
          </form>
        </div>
      )}
      
      {deliveryMessage && (
        <p id="delivery-message" style={{ 
          color: deliveryMessage.includes('available') ? 'green' : 'red' 
        }}>
          {deliveryMessage}
        </p>
      )}
    </div>
  );
}

export default DeliveryInfo;