import type { Enemy } from './types';
import gameData from './gameData.json';

export const ENEMIES: Enemy[] = (gameData as any).enemies;
