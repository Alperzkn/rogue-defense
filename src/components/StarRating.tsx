import React from 'react';
import { Colors } from '../theme/colors';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

export function StarRating({ rating, max = 5, size = 14 }: StarRatingProps) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          fontSize: size,
          color: i < rating ? Colors.electric : Colors.bgBorder,
          textShadow: i < rating ? `0 0 6px ${Colors.electric}` : 'none',
        }}>★</span>
      ))}
    </span>
  );
}
