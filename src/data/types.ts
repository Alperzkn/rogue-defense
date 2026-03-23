export type SkillType = 'fire' | 'electric' | 'energy' | 'physical' | 'gravity' | 'field';
export type CardTag = 'Chain' | 'Combo' | 'Standard';
export type CardTier = 1 | 2 | 3;
export type ChipSocket = 'emitter' | 'lidar' | 'processor' | 'controller' | 'database' | 'battery';

export interface SkillCard {
  name: string;
  description: string;
  tag: CardTag;
  tier: CardTier;
  lockedLevel?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  icon: string; // emoji fallback
  cards: SkillCard[];
  tips?: string[];
}

export interface ChipStat {
  description: string;
  chance: number;
  isUltraRare?: boolean; // 0.05% or below
}

export interface ChipSocketData {
  id: ChipSocket;
  name: string;
  icon: string;
  color: string;
  description: string;
  stats: ChipStat[];
}

export interface Combo {
  id: string;
  name: string;
  skills: string[]; // skill ids
  description: string;
  cards: string[]; // card names that enable the combo
  synergy: string;
  rating: 1 | 2 | 3 | 4 | 5;
  playstyle: string;
  tips: string[];
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sources: string[];
}
