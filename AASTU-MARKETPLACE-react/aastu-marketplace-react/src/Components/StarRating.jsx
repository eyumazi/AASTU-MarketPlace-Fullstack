
import React from 'react';
import { useState } from 'react';
import '../CSS/StarRating.css'; // Make sure to include Font Awesome in your project

function StarRating({ initialRating = 4, reviewCount = 150, interactive = false }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating">
      <span className="head"></span>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={`fa fa-star ${
              (hover || rating) >= ratingValue ? 'checked' : ''
            }`}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              color: (hover || rating) >= ratingValue ? '#ffc107' : '#e4e5e9',
            }}
            onClick={() => interactive && setRating(ratingValue)}
            onMouseEnter={() => interactive && setHover(ratingValue)}
            onMouseLeave={() => interactive && setHover(null)}
          >
            {index === 4 && ` (${reviewCount} reviews)`}
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;