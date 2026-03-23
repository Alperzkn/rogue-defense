import { StatusEffect } from './types';
import { Colors } from '../theme/colors';

export const STATUS_EFFECTS: StatusEffect[] = [
  {
    id: 'burn',
    name: 'Burn',
    description: 'Deals fire damage over time. Can be amplified by Ignition Amplification (+100% Burn DMG). Enemies with Burn explode on death (Death Ignition card).',
    icon: '🔥',
    color: Colors.burn,
    sources: ['Flame Missile (Ignition card)', 'Firewheel (Firewheel Ignition)', 'Beam (Energy Detonation trigger)', 'LiDAR chip: Flame Missile inflicts Burn for 3s'],
  },
  {
    id: 'slow',
    name: 'Slow',
    description: 'Reduces enemy movement speed. Stacks up to 90% slow with Stasis Field. Increases Distortion Field damage via Field Suppression (up to +200% bonus DMG).',
    icon: '🌊',
    color: Colors.slow,
    sources: ['Distortion Field (Stasis Field card)', 'Beam (Slow Beam on Deflected Beams)', 'Matrix Drone (Amplified Pulse card)', 'Thunder Core chip: inflicts 4s Slow', 'Processor chip: Thunder Core inflicts Slow'],
  },
  {
    id: 'paralyze',
    name: 'Paralyze',
    description: 'Stuns enemies, preventing movement and attacks. Paralyzed enemies trigger small Chain Lightning with Paralysis Chain. Life Erosion deals 3% MAX HP when paralyzing.',
    icon: '⚡',
    color: Colors.paralyze,
    sources: ['Thunder Core (Lightning Paralysis card)', 'Beam (Energy Paralysis Combo card)', 'Distortion Field (Electric Field Combo card)', 'Lightning Bomb (Electro Interference card)', 'Guardian bullet chip effect'],
  },
  {
    id: 'disruption',
    name: 'Disruption',
    description: 'Stackable debuff. Reaching MAX stacks triggers a high burst of damage (Disruption Burst). At Tier 3, Area Disruption deals extra DMG at max stacks.',
    icon: '🌀',
    color: Colors.disruption,
    sources: ['Distortion Field (Disruption Force card)', 'Traction Field (Field Disruption Combo card)'],
  },
  {
    id: 'vulnerable',
    name: 'Vulnerable',
    description: 'Increases damage taken by the enemy. Applied by Focus Laser\'s Laser Penetration and Beam\'s Vulnerable Beam (on Sweeping Beams).',
    icon: '💢',
    color: Colors.vulnerable,
    sources: ['Focus Laser (Laser Penetration card)', 'Beam (Vulnerable Beam on Sweeping Beams)', 'Traction Field chip: Vulnerable spreads to nearby enemies'],
  },
  {
    id: 'physicalVulnerable',
    name: 'Physical Vulnerable',
    description: 'Increases physical damage taken. Applied by Phantom Dart\'s Piercing Mark. Especially powerful when combined with Matrix Drone and Mortar.',
    icon: '🎯',
    color: Colors.physicalVulnerable,
    sources: ['Phantom Dart (Piercing Mark Combo card)'],
  },
  {
    id: 'injured',
    name: 'Injured',
    description: 'Damage-over-time debuff applied to enemies. All Matrix Drone damage can inflict Injured via a LiDAR chip effect.',
    icon: '🩸',
    color: Colors.injured,
    sources: ['LiDAR chip: Matrix Drone damage inflicts Injured for 4s'],
  },
];
