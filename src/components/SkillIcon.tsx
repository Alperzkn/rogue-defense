import React from 'react';
import type { Skill } from '../data/types';

interface SkillIconProps {
  skill: Pick<Skill, 'icon' | 'iconImage' | 'iconScale' | 'name'>;
  size?: number;
  className?: string;
}

export function SkillIcon({ skill, size = 24, className }: SkillIconProps) {
  if (skill.iconImage) {
    const scale = skill.iconScale ?? 2.1;
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={skill.iconImage}
          alt={skill.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translateY(8%)`,
          }}
        />
      </span>
    );
  }
  return <span className={className}>{skill.icon}</span>;
}
