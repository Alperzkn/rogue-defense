import React from 'react';
import { ARCUS } from '../lib/arcus';

/** Simplified Arcus mark: a rounded arc with the diagonal cut, in the brand cream. */
export function ArcusMark({ size = 28, color = ARCUS.brand.cream }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 4h12a12 12 0 0 1 12 12v12h-9V16a3 3 0 0 0-3-3H4z" fill={color} />
      <path d="M4 14h8l-8 8z" fill={color} />
      <path d="M5 28l10-10h3v10z" fill={color} />
    </svg>
  );
}
