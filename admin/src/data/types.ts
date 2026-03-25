export type SkillType = 'fire' | 'electric' | 'energy' | 'physical' | 'field';
export type CardTag = 'Chain' | 'Combo' | 'Standard';
export type CardTier = 1 | 2 | 3;
export type ChipSocket = 'emitter' | 'lidar' | 'processor' | 'controller' | 'database' | 'battery';

export interface SkillCard {
  name: string;
  description: string;
  tag: CardTag;
  tier: CardTier;
  lockedLevel?: number;
  isSpecial?: boolean;
  // Chain: other cards from the SAME skill that must be selected first
  requiresCards?: string[];
  // Combo: another SKILL that must be in the build for this card to be available
  requiredSkillId?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  icon: string;
  iconImage?: string;
  iconScale?: number;
  cards: SkillCard[];
  tips?: string[];
}

export interface ChipStat {
  description: string;
  chance: number;
  isUltraRare?: boolean;
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
  skills: string[];
  description: string;
  cards: string[];
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

export interface GameData {
  skills: Skill[];
  combos: Combo[];
  chipSockets: ChipSocketData[];
  statusEffects: StatusEffect[];
}
