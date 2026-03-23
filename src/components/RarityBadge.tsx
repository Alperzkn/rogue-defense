import React from 'react';
import { Badge } from './ui/badge';

export function rarityInfo(chance: number): { label: string; variant: 'mythic' | 'epic' | 'rare' | 'common' } {
  if (chance <= 0.05) return { label: 'ULTRA RARE', variant: 'mythic' };
  if (chance <= 0.10) return { label: 'VERY RARE', variant: 'epic' };
  if (chance <= 0.25) return { label: 'RARE', variant: 'rare' };
  return { label: 'COMMON', variant: 'common' };
}

export function RarityBadge({ chance }: { chance: number }) {
  const { label, variant } = rarityInfo(chance);
  return <Badge variant={variant}>{label} {chance}%</Badge>;
}
