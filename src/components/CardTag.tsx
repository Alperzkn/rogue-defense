import React from 'react';
import { Colors } from '../theme/colors';
import type { CardTag as CardTagType } from '../data/types';

interface CardTagProps {
  tag: CardTagType;
}

const TAG_CONFIG: Record<CardTagType, { color: string; label: string } | null> = {
  Chain: { color: Colors.chain, label: 'Chain' },
  Combo: { color: Colors.combo, label: 'Combo' },
  Standard: null,
};

export function CardTag({ tag }: CardTagProps) {
  const config = TAG_CONFIG[tag];
  if (!config) return null;

  return (
    <span style={{
      display: 'inline-block',
      border: `1px solid ${config.color}`,
      backgroundColor: `${config.color}20`,
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
      color: config.color,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {config.label}
    </span>
  );
}
