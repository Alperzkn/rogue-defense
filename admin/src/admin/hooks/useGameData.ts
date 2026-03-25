import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GameData, Skill, Combo, ChipSocketData, StatusEffect } from '../../data/types';

interface GameDataContext {
  data: GameData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Skills
  saveSkill: (skill: Skill, isNew?: boolean) => Promise<void>;
  deleteSkill: (id: string) => Promise<{ comboReferences: string[] }>;
  // Combos
  saveCombo: (combo: Combo, isNew?: boolean) => Promise<void>;
  deleteCombo: (id: string) => Promise<void>;
  // Chip sockets
  saveChipSocket: (socket: ChipSocketData) => Promise<void>;
  // Status effects
  saveStatusEffect: (effect: StatusEffect, isNew?: boolean) => Promise<void>;
  deleteStatusEffect: (id: string) => Promise<void>;
}

const Ctx = createContext<GameDataContext>(null!);
export const useGameData = () => useContext(Ctx);
export const GameDataContext = Ctx;

export function useGameDataProvider(): GameDataContext {
  const [data, setData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveSkill = useCallback(async (skill: Skill, isNew = false) => {
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/skills' : `/api/skills/${skill.id}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(skill) });
    if (!res.ok) throw new Error(await res.text());
    await refresh();
  }, [refresh]);

  const deleteSkill = useCallback(async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    await refresh();
    return result;
  }, [refresh]);

  const saveCombo = useCallback(async (combo: Combo, isNew = false) => {
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/combos' : `/api/combos/${combo.id}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(combo) });
    if (!res.ok) throw new Error(await res.text());
    await refresh();
  }, [refresh]);

  const deleteCombo = useCallback(async (id: string) => {
    const res = await fetch(`/api/combos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    await refresh();
  }, [refresh]);

  const saveChipSocket = useCallback(async (socket: ChipSocketData) => {
    const res = await fetch(`/api/chipSockets/${socket.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(socket) });
    if (!res.ok) throw new Error(await res.text());
    await refresh();
  }, [refresh]);

  const saveStatusEffect = useCallback(async (effect: StatusEffect, isNew = false) => {
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/statusEffects' : `/api/statusEffects/${effect.id}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(effect) });
    if (!res.ok) throw new Error(await res.text());
    await refresh();
  }, [refresh]);

  const deleteStatusEffect = useCallback(async (id: string) => {
    const res = await fetch(`/api/statusEffects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    await refresh();
  }, [refresh]);

  return { data, loading, error, refresh, saveSkill, deleteSkill, saveCombo, deleteCombo, saveChipSocket, saveStatusEffect, deleteStatusEffect };
}
