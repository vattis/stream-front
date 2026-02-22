import { useState } from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 'medium',
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`${styles.starRating} ${styles[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= displayValue ? styles.filled : ''} ${readOnly ? styles.readOnly : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
        >
          {star <= displayValue ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}
