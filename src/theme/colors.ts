export const Colors = {
  // Backgrounds
  bg: '#08090E',
  bgCard: '#0E1017',
  bgElevated: '#14161F',
  bgBorder: '#1E2030',

  // Primary neon palette
  cyan: '#00C8FF',
  cyanDim: '#0077AA',
  purple: '#7B2FBE',
  purpleDim: '#3D1560',
  purpleGlow: '#B44FFF',

  // Skill type colors
  fire: '#FF4500',
  fireDim: '#7A2100',
  electric: '#FFD700',
  electricDim: '#7A6500',
  energy: '#B44FFF',
  physical: '#3B82F6',
  field: '#00FF88',
  fieldDim: '#007A42',

  // Status colors
  burn: '#FF4500',
  slow: '#00BFFF',
  paralyze: '#FFD700',
  disruption: '#9B59B6',
  vulnerable: '#FF1744',
  physicalVulnerable: '#FF6D00',
  injured: '#E91E63',

  // Text
  textPrimary: '#E8F4FD',
  textSecondary: '#7AB8D4',
  textMuted: '#3A6A8A',

  // Chip types
  emitter: '#FF6B9D',
  lidar: '#00E5FF',
  processor: '#ADFF2F',
  controller: '#FF9100',
  database: '#E040FB',
  battery: '#64FFDA',

  // Rarity
  common: '#9E9E9E',
  fine: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
  ultimate: '#F44336',
  mythic: '#FFD700',

  // Card type tags
  chain: '#00C8FF',
  combo: '#FF6B9D',
  standard: '#7AB8D4',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type SkillType = 'fire' | 'electric' | 'energy' | 'physical' | 'field';
export type ChipSocket = 'emitter' | 'lidar' | 'processor' | 'controller' | 'database' | 'battery';
export type StatusEffect = 'burn' | 'slow' | 'paralyze' | 'disruption' | 'vulnerable' | 'physicalVulnerable' | 'injured';

export const SkillTypeColors: Record<SkillType, string> = {
  fire: Colors.fire,
  electric: Colors.electric,
  energy: Colors.energy,
  physical: Colors.physical,
  field: Colors.field,
};

export const ChipSocketColors: Record<ChipSocket, string> = {
  emitter: Colors.emitter,
  lidar: Colors.lidar,
  processor: Colors.processor,
  controller: Colors.controller,
  database: Colors.database,
  battery: Colors.battery,
};

export const StatusEffectColors: Record<StatusEffect, string> = {
  burn: Colors.burn,
  slow: Colors.slow,
  paralyze: Colors.paralyze,
  disruption: Colors.disruption,
  vulnerable: Colors.vulnerable,
  physicalVulnerable: Colors.physicalVulnerable,
  injured: Colors.injured,
};
