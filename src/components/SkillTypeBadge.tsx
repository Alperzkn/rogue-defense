import React from 'react';
import { Badge } from './ui/badge';
import type { SkillType } from '../data/types';

const TYPE_LABELS: Record<SkillType, string> = {
  fire: 'FIRE', electric: 'ELECTRIC', energy: 'ENERGY',
  physical: 'PHYSICAL', gravity: 'GRAVITY', field: 'FIELD',
};

export function SkillTypeBadge({ type }: { type: SkillType }) {
  return <Badge variant={type}>{TYPE_LABELS[type]}</Badge>;
}
