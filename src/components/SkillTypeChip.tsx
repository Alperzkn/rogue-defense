import React from 'react';
import type { SkillType } from '../data/types';
import { SkillTypeColors } from '../theme/colors';

const TYPE_LABELS: Record<SkillType, string> = {
  fire: 'FIRE',
  electric: 'ELECTRIC',
  energy: 'ENERGY',
  physical: 'PHYSICAL',
  field: 'FIELD',
};

export function SkillTypeChip({ type }: { type: SkillType }) {
  const color = SkillTypeColors[type];
  return (
    <span style={{
      display: 'inline-block',
      border: `1px solid ${color}`,
      backgroundColor: `${color}18`,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: 1,
      color,
      whiteSpace: 'nowrap',
    }}>
      {TYPE_LABELS[type]}
    </span>
  );
}
