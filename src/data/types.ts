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
  isSpecial?: boolean; // purple/pink card in game — powerful standalone effect
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
  icon: string; // emoji fallback
  iconImage?: string; // path to image icon (overrides emoji)
  iconScale?: number; // custom scale for iconImage (default 2.1)
  isFixed?: boolean; // always present in build (e.g. Guardian Turret)
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
