import React, { useState } from 'react';
import '../CSS/SizeSelector.css'; // Create a separate CSS file

const SizeSelector = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="size">
      <label htmlFor="size-selector">Size:</label>
      <div className="size-buttons">
        {sizes.map((size) => (
          <input
            key={size}
            type="button"
            className={`space ${selectedSize === size ? 'selected' : ''}`}
            value={size}
            onClick={() => setSelectedSize(size)}
            aria-label={`Select size ${size}`}
            aria-pressed={selectedSize === size}
          />
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;