import React from 'react';
import { Colors, FontWeight } from '../theme';

interface NeonTextProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: React.CSSProperties['fontWeight'];
  style?: React.CSSProperties;
  glow?: boolean;
  center?: boolean;
  numberOfLines?: number;
}

export function NeonText({
  children,
  color = Colors.cyan,
  size = 14,
  weight = FontWeight.semibold,
  style,
  glow = false,
  center = false,
  numberOfLines,
}: NeonTextProps) {
  return (
    <span
      style={{
        color,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: 0.3,
        textAlign: center ? 'center' : 'left',
        textShadow: glow ? `0 0 8px ${color}CC, 0 0 20px ${color}66` : 'none',
        display: numberOfLines ? '-webkit-box' : 'inline',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        overflow: numberOfLines ? 'hidden' : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
