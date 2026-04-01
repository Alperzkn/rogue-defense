import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, Search, X, Skull, Bug, Zap, Flame, Cpu as CpuIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tooltip } from '../components/ui/tooltip';
import { ENEMIES, SKILLS } from '../data';
import type { Enemy, DamageType, SkillType } from '../data/types';
import { SkillTypeColors } from '../theme/colors';
import { SkillIcon, SkillTypeBadge } from '../components';
import { fadeUp, TIMING, EASE } from '../lib/animations';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const TYPE_COLORS: Record<string, string> = {
  boss: '#FF4500',
  elite: '#B44FFF',
  minion: '#6B7280',
};

const TYPE_LABELS: Record<string, string> = {
  boss: 'Boss',
  elite: 'Elite',
  minion: 'Minion',
};

const DAMAGE_TYPE_CONFIG: Record<DamageType, { label: string; color: string; icon: string }> = {
  fire: { label: 'Fire', color: '#FF4500', icon: '🔥' },
  electric: { label: 'Electric', color: '#FFD700', icon: '⚡' },
  energy: { label: 'Energy', color: '#B44FFF', icon: '💜' },
  physical: { label: 'Physical', color: '#3B82F6', icon: '💪' },
  field: { label: 'Field', color: '#00FF88', icon: '🌀' },
};

const SKILL_TYPE_TO_DAMAGE: Record<SkillType, DamageType> = {
  fire: 'fire',
  electric: 'electric',
  energy: 'energy',
  physical: 'physical',
  field: 'field',
};

function ResistanceBar({ type, value }: { type: DamageType; value: number }) {
  const config = DAMAGE_TYPE_CONFIG[type];
  const isWeak = value > 0;
  const isResistant = value < 0;

  return (
    <Tooltip content={`${isWeak ? 'Weak' : isResistant ? 'Resistant' : 'Neutral'}: ${value > 0 ? '+' : ''}${value}% ${config.label} DMG`}>
      <div className="flex items-center gap-1.5 cursor-default">
        <span className="text-[10px] w-12 text-right text-muted-foreground">{config.label}</span>
        <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden relative min-w-[80px]">
          {value !== 0 && (
            <div
              className="absolute top-0 h-full rounded-full transition-all"
              style={{
                backgroundColor: isWeak ? config.color : '#EF4444',
                width: `${Math.min(Math.abs(value), 100)}%`,
                left: isResistant ? undefined : '50%',
                right: isWeak ? undefined : '50%',
                opacity: 0.7,
              }}
            />
          )}
          <div className="absolute left-1/2 top-0 w-px h-full bg-muted-foreground/20" />
        </div>
        <span className={cn(
          'text-[10px] font-bold w-10',
          isWeak ? 'text-green-400' : isResistant ? 'text-red-400' : 'text-muted-foreground/50',
        )}>
          {value === 0 ? '—' : `${value > 0 ? '+' : ''}${value}%`}
        </span>
      </div>
    </Tooltip>
  );
}

function getRecommendedSkills(enemy: Enemy): { skill: typeof SKILLS[0]; reason: string; score: number }[] {
  const results: { skill: typeof SKILLS[0]; reason: string; score: number }[] = [];

  for (const skill of SKILLS) {
    if (skill.isFixed) continue;
    const dmgType = SKILL_TYPE_TO_DAMAGE[skill.type];
    const resistance = enemy.resistances[dmgType];
    if (resistance > 0) {
      results.push({
        skill,
        reason: `${skill.type} deals +${resistance}% DMG`,
        score: resistance,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

function getWeakSkills(enemy: Enemy): { skill: typeof SKILLS[0]; reason: string }[] {
  const results: { skill: typeof SKILLS[0]; reason: string }[] = [];

  for (const skill of SKILLS) {
    if (skill.isFixed) continue;
    const dmgType = SKILL_TYPE_TO_DAMAGE[skill.type];
    const resistance = enemy.resistances[dmgType];
    if (resistance < 0) {
      results.push({
        skill,
        reason: `${skill.type} deals ${resistance}% DMG`,
      });
    }
  }

  return results;
}

function EnemyCard({ enemy, index }: { enemy: Enemy; index: number }) {
  const [open, setOpen] = useState(false);
  const typeColor = TYPE_COLORS[enemy.type];
  const recommended = getRecommendedSkills(enemy);
  const weak = getWeakSkills(enemy);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: TIMING.normal, delay: index * TIMING.stagger, ease: EASE.spring }}
    >
      <Card
        className="group relative overflow-hidden transition-all duration-200 hover:brightness-110"
        style={{
          border: `1px solid ${typeColor}30`,
          background: `linear-gradient(135deg, ${typeColor}15, ${typeColor}05 50%, hsl(var(--card)) 100%)`,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="relative w-full text-left"
          aria-label={`Toggle ${enemy.name} details`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="text-[15px] font-bold text-foreground">{enemy.name}</h3>
                  <Badge
                    className="text-[9px]"
                    style={{
                      borderColor: `${typeColor}50`,
                      backgroundColor: `${typeColor}15`,
                      color: typeColor,
                    }}
                  >
                    {TYPE_LABELS[enemy.type]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">Stage {enemy.firstStage}+</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">{enemy.ability}</p>

                {/* Quick resistance indicators */}
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(enemy.resistances) as [DamageType, number][]).map(([type, val]) => {
                    if (val === 0) return null;
                    const config = DAMAGE_TYPE_CONFIG[type];
                    return (
                      <Tooltip key={type} content={`${val > 0 ? 'Weak to' : 'Resistant to'} ${config.label}: ${val > 0 ? '+' : ''}${val}%`}>
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold cursor-default',
                          val > 0
                            ? 'border-green-500/20 bg-green-500/8 text-green-400'
                            : 'border-red-500/20 bg-red-500/8 text-red-400',
                        )}>
                          {config.icon} {val > 0 ? '+' : ''}{val}%
                        </span>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
              <ChevronDown className={cn(
                'mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform duration-200',
                open && 'rotate-180',
              )} />
            </div>
          </CardContent>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: TIMING.expand, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="mx-4 h-px bg-border/30" />
              <CardContent className="p-4 pt-3">
                {/* Resistance bars */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <Shield className="inline h-3 w-3 mr-1" />
                    Damage Modifiers
                  </p>
                  <div className="space-y-1">
                    {(Object.keys(DAMAGE_TYPE_CONFIG) as DamageType[]).map(type => (
                      <ResistanceBar key={type} type={type} value={enemy.resistances[type]} />
                    ))}
                  </div>
                </div>

                {/* Recommended skills */}
                {recommended.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400 mb-2">
                      Best Skills Against
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {recommended.map(({ skill, reason }) => (
                        <Tooltip key={skill.id} content={reason}>
                          <div className="flex items-center gap-1.5 rounded-lg border px-2 py-1 cursor-default"
                            style={{ borderColor: `${SkillTypeColors[skill.type]}25`, backgroundColor: `${SkillTypeColors[skill.type]}08` }}>
                            <SkillIcon skill={skill} size={14} />
                            <span className="text-[10px] font-medium text-foreground">{skill.name}</span>
                            <SkillTypeBadge type={skill.type} />
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weak skills */}
                {weak.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-2">
                      Avoid These Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {weak.map(({ skill, reason }) => (
                        <Tooltip key={skill.id} content={reason}>
                          <div className="flex items-center gap-1.5 rounded-lg border border-red-500/15 bg-red-500/5 px-2 py-1 cursor-default opacity-60">
                            <SkillIcon skill={skill} size={14} />
                            <span className="text-[10px] font-medium text-foreground">{skill.name}</span>
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stages */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Appears in Stages
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(stage => {
                      const active = enemy.stages.includes(stage);
                      return (
                        <div
                          key={stage}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded text-[9px] font-bold',
                            active
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-secondary/30 text-muted-foreground/30 border border-border/20',
                          )}
                        >
                          {stage}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

const TYPE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Bosses', value: 'boss' },
  { label: 'Elites', value: 'elite' },
  { label: 'Minions', value: 'minion' },
];

export function EnemiesScreen() {
  useDocumentTitle('Enemies');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<number | null>(null);

  const filtered = useMemo(() =>
    ENEMIES.filter(e => {
      const matchType = typeFilter === 'all' || e.type === typeFilter;
      const matchStage = stageFilter === null || e.stages.includes(stageFilter);
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.ability.toLowerCase().includes(search.toLowerCase());
      return matchType && matchStage && matchSearch;
    }).sort((a, b) => {
      const typeOrder = { boss: 0, elite: 1, minion: 2 };
      if (typeOrder[a.type] !== typeOrder[b.type]) return typeOrder[a.type] - typeOrder[b.type];
      return a.firstStage - b.firstStage;
    }),
  [search, typeFilter, stageFilter]);

  const bossCount = ENEMIES.filter(e => e.type === 'boss').length;
  const eliteCount = ENEMIES.filter(e => e.type === 'elite').length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Enemies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ENEMIES.length} enemies &middot; {bossCount} bosses &middot; {eliteCount} elites &middot; 15 stages
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp(0.04)} className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search enemies..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
          />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {/* Type filters */}
          {TYPE_FILTERS.map(f => {
            const active = typeFilter === f.value;
            const color = f.value === 'all' ? '#00C8FF' : TYPE_COLORS[f.value];
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-200',
                  active ? 'text-foreground' : 'border-border/50 text-muted-foreground hover:text-foreground',
                )}
                style={active ? { borderColor: `${color}60`, backgroundColor: `${color}12`, color } : {}}
              >
                {f.label}
              </button>
            );
          })}

          {/* Stage filter */}
          <div className="flex items-center gap-1 ml-2">
            <span className="text-[10px] text-muted-foreground">Stage:</span>
            <select
              value={stageFilter ?? ''}
              onChange={e => setStageFilter(e.target.value ? Number(e.target.value) : null)}
              className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Stage {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      {(search || typeFilter !== 'all' || stageFilter !== null) && (
        <p className="mb-3 text-[11px] text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Enemy list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((enemy, i) => (
            <EnemyCard key={enemy.id} enemy={enemy} index={i} />
          ))}
        </div>
      ) : (
        <motion.div {...fadeUp(0)} className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <Skull className="h-8 w-8 opacity-20" />
          <p className="text-sm">No enemies match your filters</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setTypeFilter('all'); setStageFilter(null); }}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary hover:text-foreground"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
