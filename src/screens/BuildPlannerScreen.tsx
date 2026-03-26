import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown, Sparkles, Star, Info, Search, Shield, Swords, Link2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tooltip } from '../components/ui/tooltip';
import { SkillTypeBadge, SkillIcon } from '../components';
import { SKILLS, CHIP_SOCKETS, COMBOS } from '../data';
import { SkillTypeColors } from '../theme/colors';
import { fadeUp, TIMING, EASE } from '../lib/animations';
import type { Skill, SkillCard, ChipSocketData, ChipStat, CardTier } from '../data/types';

const MAX_SKILLS = 4;

// ── Chip recommendation logic ──
function getRecommendedChips(
  selectedSkills: Skill[],
  socket: ChipSocketData,
): (ChipStat & { score: number; reason: string })[] {
  const skillNames = selectedSkills.map(s => s.name);
  const skillTypes = new Set(selectedSkills.map(s => s.type));

  return socket.stats
    .map(stat => {
      let score = 0;
      let reason = '';
      const desc = stat.description;

      // Direct skill name match — highest priority
      for (const name of skillNames) {
        if (desc.includes(name)) {
          score += 10;
          reason = `Boosts ${name}`;
          break;
        }
      }

      // Skill type DMG match
      if (skillTypes.has('fire') && /Fire DMG/i.test(desc)) {
        score += 6;
        reason = reason || 'Fire DMG boost';
      }
      if (skillTypes.has('electric') && /Electric DMG/i.test(desc)) {
        score += 6;
        reason = reason || 'Electric DMG boost';
      }
      if (skillTypes.has('energy') && /Energy DMG/i.test(desc)) {
        score += 6;
        reason = reason || 'Energy DMG boost';
      }
      if (skillTypes.has('physical') && /Physical DMG/i.test(desc)) {
        score += 6;
        reason = reason || 'Physical DMG boost';
      }
      if (skillTypes.has('field') && /Force-field DMG/i.test(desc)) {
        score += 6;
        reason = reason || 'Force-field DMG boost';
      }

      // Explosion DMG if any skill has explosion cards
      if (/Explosion DMG/i.test(desc)) {
        const hasExplosion = selectedSkills.some(s =>
          s.cards.some(c => /explo/i.test(c.name) || /explo/i.test(c.description))
        );
        if (hasExplosion) {
          score += 4;
          reason = reason || 'Explosion synergy';
        }
      }

      // Debuff duration if multiple debuff skills
      if (/debuff duration/i.test(desc) || /Extend.*debuff/i.test(desc)) {
        score += 3;
        reason = reason || 'Debuff duration';
      }

      // Generic DMG boosts
      if (/^DMG \+\d/.test(desc) || /^ATK \+/.test(desc)) {
        score += 2;
        reason = reason || 'General boost';
      }

      // Crit
      if (/Crit/i.test(desc)) {
        score += 2;
        reason = reason || 'Crit boost';
      }

      // Ultra rare bonus
      if (stat.isUltraRare) {
        score += 3;
        reason = reason || 'Ultra rare';
      }

      // Penetration bonus if dart/mortar selected
      if (/Penetration/i.test(desc) && selectedSkills.some(s => ['phantom-dart', 'mortar'].includes(s.id))) {
        score += 5;
        reason = reason || 'Penetration synergy';
      }

      return { ...stat, score, reason };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ── Boost summary ──
function getBoostSummary(
  selectedSkills: Skill[],
  selectedChips: Record<string, ChipStat[]>,
) {
  const boosts: { label: string; value: string; color: string }[] = [];
  const chipEffects = Object.values(selectedChips).flat();

  // Count skill types
  const typeCounts: Record<string, number> = {};
  for (const s of selectedSkills) {
    typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
  }

  // Type synergy
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count >= 2) {
      const color = SkillTypeColors[type as keyof typeof SkillTypeColors] || '#888';
      boosts.push({ label: `${type.charAt(0).toUpperCase() + type.slice(1)} Synergy`, value: `${count} skills`, color });
    }
  }

  // Chip boosts
  for (const chip of chipEffects) {
    const dmgMatch = chip.description.match(/DMG \+(\d+)%/);
    if (dmgMatch) {
      boosts.push({ label: chip.description.split(',')[0], value: `+${dmgMatch[1]}%`, color: '#00C8FF' });
    } else {
      boosts.push({ label: chip.description.length > 40 ? chip.description.slice(0, 40) + '...' : chip.description, value: 'Active', color: '#B44FFF' });
    }
  }

  // Total cards available
  const totalCards = selectedSkills.reduce((a, s) => a + s.cards.length, 0);
  if (totalCards > 0) {
    boosts.push({ label: 'Total Upgrade Cards', value: `${totalCards}`, color: '#FFD700' });
  }

  // Combo cards count
  const comboCards = selectedSkills.reduce((a, s) => a + s.cards.filter(c => c.tag === 'Combo').length, 0);
  if (comboCards > 0) {
    boosts.push({ label: 'Combo Cards Available', value: `${comboCards}`, color: '#FF6B9D' });
  }

  return boosts;
}

// ── Skill Picker Modal (multi-select) ──
function SkillPicker({
  open,
  selected,
  onToggle,
  onClose,
}: {
  open: boolean;
  selected: Skill[];
  onToggle: (skill: Skill) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  const selectedIds = new Set(selected.map(s => s.id));
  const isFull = selected.length >= MAX_SKILLS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Select Skills</h3>
            <p className="text-xs text-muted-foreground">{selected.length}/{MAX_SKILLS} selected &middot; Guardian Turret is fixed</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            Done
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {SKILLS.filter(s => !s.isFixed).map(skill => {
            const color = SkillTypeColors[skill.type];
            const isSelected = selectedIds.has(skill.id);
            const disabled = !isSelected && isFull;
            return (
              <button
                key={skill.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggle(skill)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200',
                  isSelected
                    ? 'border-primary/40 bg-primary/8'
                    : disabled
                      ? 'border-border/30 opacity-40 cursor-not-allowed'
                      : 'border-border hover:border-primary/30 hover:bg-secondary/50',
                )}
                style={isSelected ? { borderColor: `${color}50`, background: `${color}10` } : {}}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                  <SkillIcon skill={skill} size={40} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-foreground truncate block">{skill.name}</span>
                  <SkillTypeBadge type={skill.type} />
                </div>
                {isSelected && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-[10px] font-bold">{selected.findIndex(s => s.id === skill.id) + 1}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

const SLOTS_PER_SOCKET = 6;
const NORMAL_CARDS_REQUIRED = 3;
const SPECIAL_CARDS_PER_TIER = 1;
const CARDS_PER_TIER = NORMAL_CARDS_REQUIRED + SPECIAL_CARDS_PER_TIER;

const TIER_CONFIG: Record<CardTier, { label: string; color: string }> = {
  1: { label: 'Initial Unlocked', color: '#00C8FF' },
  2: { label: 'Star Tier 2', color: '#B44FFF' },
  3: { label: 'Star Tier 3', color: '#FFD700' },
};

// ── Skill Card Selector ──
function SkillCardSelector({
  skill,
  selectedCards,
  onToggleCard,
}: {
  skill: Skill;
  selectedCards: SkillCard[];
  onToggleCard: (card: SkillCard) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = SkillTypeColors[skill.type];
  const rounds: CardTier[] = [1, 2, 3];

  // selectedCards is a flat array but we need to know which round each card belongs to.
  // We store cards grouped by round using a stable mapping:
  // Round 1 = first 4 cards, Round 2 = next 4, Round 3 = next 4
  // But we tag each card with its round at selection time via a wrapper.

  // Helper: get all cards selected across all rounds
  const allSelected = selectedCards;

  // Determine which cards belong to which round based on selection order
  const getRoundCards = (round: CardTier): SkillCard[] => {
    const start = (round - 1) * CARDS_PER_TIER;
    const end = round * CARDS_PER_TIER;
    return allSelected.slice(start, end);
  };

  // Current round based on completed sets
  const completedRounds = Math.min(Math.floor(allSelected.length / CARDS_PER_TIER), 3);
  const currentRound = Math.min(completedRounds + 1, 3) as CardTier;
  const currentRoundCards = getRoundCards(currentRound);

  const getRoundState = (round: CardTier) => {
    const cards = getRoundCards(round);
    const normalCount = cards.filter(c => !c.isSpecial).length;
    const specialCount = cards.filter(c => c.isSpecial).length;
    const normalUnlocked = normalCount >= NORMAL_CARDS_REQUIRED;
    return { cards, total: cards.length, normalCount, specialCount, normalUnlocked };
  };

  // A round is "locked" only if it's complete AND the next round has cards selected.
  // If the next round is empty, the completed round is still editable.
  const isRoundLocked = (round: CardTier): boolean => {
    if (round >= 3) return false;
    const thisComplete = getRoundCards(round).length >= CARDS_PER_TIER;
    const nextHasCards = getRoundCards((round + 1) as CardTier).length > 0;
    return thisComplete && nextHasCards;
  };

  const canSelectCard = (card: SkillCard, round: CardTier): boolean => {
    if (isRoundLocked(round)) return false;
    if (card.tier > round) return false;

    // Check if previous round is complete (needed to unlock this round)
    if (round > 1) {
      const prevComplete = getRoundCards((round - 1) as CardTier).length >= CARDS_PER_TIER;
      if (!prevComplete) return false;
    }

    const roundCardsHere = getRoundCards(round);
    const isSelected = roundCardsHere.some(sc => sc.name === card.name && sc.tier === card.tier);
    if (isSelected) return true; // can always deselect

    const state = getRoundState(round);
    if (state.total >= CARDS_PER_TIER) return false;

    if (card.isSpecial) {
      return state.normalUnlocked && state.specialCount < SPECIAL_CARDS_PER_TIER;
    }
    return state.normalCount < NORMAL_CARDS_REQUIRED;
  };

  // Check if a card is selected in ANY round
  const isCardSelected = (card: SkillCard): boolean => {
    return allSelected.some(sc => sc.name === card.name && sc.tier === card.tier);
  };

  return (
    <div className="rounded-lg border p-3" style={{ borderColor: `${color}30`, background: `${color}08` }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
          <SkillIcon skill={skill} size={32} />
        </span>
        <span className="text-sm font-semibold text-foreground">{skill.name}</span>
        <SkillTypeBadge type={skill.type} />
        {allSelected.length > 0 && (
          <span className="text-[10px] font-medium text-muted-foreground">{allSelected.length} cards</span>
        )}
        <ChevronDown className={cn('ml-auto h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4">
              {rounds.map(round => {
                // Cards from previous rounds that were selected there (locked away)
                const prevRoundsSelected = allSelected.slice(0, (round - 1) * CARDS_PER_TIER);
                const thisRoundNewCards = skill.cards.filter(c => c.tier === round);
                const previousTierUnselected = skill.cards.filter(c =>
                  c.tier < round && !prevRoundsSelected.some(sc => sc.name === c.name && sc.tier === c.tier)
                );

                // Accessibility: need previous round complete to access this one
                const accessible = round === 1 || getRoundCards((round - 1) as CardTier).length >= CARDS_PER_TIER;
                const locked = isRoundLocked(round);
                const { label, color: tierColor } = TIER_CONFIG[round];
                const state = getRoundState(round);

                // Always show full card pool — never hide cards
                const availableCards = [...previousTierUnselected, ...thisRoundNewCards];
                const normalCards = availableCards.filter(c => !c.isSpecial);
                const specialCards = availableCards.filter(c => c.isSpecial);

                return (
                  <div key={round} className={cn(
                    !accessible && 'opacity-40 pointer-events-none',
                    locked && 'opacity-60 pointer-events-none',
                  )}>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tierColor }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: tierColor }}>
                        {label}
                        {round > 1 && <span className="text-muted-foreground"> (includes previous tiers)</span>}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {state.total}/{CARDS_PER_TIER}
                      </span>
                      {!accessible && (
                        <span className="text-[9px] text-muted-foreground">Complete previous round first</span>
                      )}
                      {locked && (
                        <span className="text-[9px] text-muted-foreground">Locked — select cards in next tier to keep</span>
                      )}
                    </div>

                    {/* Normal cards */}
                    <p className="mb-1 text-[9px] font-medium text-muted-foreground">
                      Normal ({state.normalCount}/{NORMAL_CARDS_REQUIRED})
                    </p>
                    <div className="grid grid-cols-1 gap-1 mb-2">
                      {normalCards.map((card, i) => {
                        const isSelected = isCardSelected(card);
                        const canSelect = canSelectCard(card, round);
                        return (
                          <button
                            key={`${card.name}-${card.tier}-${i}`}
                            type="button"
                            disabled={!canSelect && !isSelected}
                            onClick={() => onToggleCard(card)}
                            className={cn(
                              'flex items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors',
                              isSelected
                                ? 'border-primary/50 bg-primary/10'
                                : canSelect
                                  ? 'border-border hover:border-primary/30 hover:bg-secondary'
                                  : 'border-border/50 opacity-50 cursor-not-allowed',
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-foreground">{card.name}</span>
                                {card.tier < round && (
                                  <span className="text-[8px] text-muted-foreground/60">T{card.tier}</span>
                                )}
                                {card.tag !== 'Standard' && (
                                  <Badge variant={card.tag === 'Chain' ? 'chain' : 'combo'} className="text-[8px] px-1 py-0">{card.tag}</Badge>
                                )}
                              </div>
                              <p className="mt-0.5 text-[10px] text-muted-foreground">{card.description}</p>
                            </div>
                            {isSelected && <span className="text-[10px] font-bold text-primary shrink-0">Selected</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Special cards */}
                    <p className={cn(
                      'mb-1 text-[9px] font-medium',
                      state.normalUnlocked ? 'text-[#B44FFF]' : 'text-muted-foreground',
                    )}>
                      Special ({state.specialCount}/{SPECIAL_CARDS_PER_TIER})
                      {!state.normalUnlocked && <span className="ml-1 text-muted-foreground">— select {NORMAL_CARDS_REQUIRED} normal cards first</span>}
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {specialCards.map((card, i) => {
                        const isSelected = isCardSelected(card);
                        const canSelect = canSelectCard(card, round);
                        return (
                          <button
                            key={`${card.name}-${card.tier}-${i}`}
                            type="button"
                            disabled={!canSelect && !isSelected}
                            onClick={() => onToggleCard(card)}
                            className={cn(
                              'flex items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors',
                              isSelected
                                ? 'border-[#B44FFF]/50 bg-[#B44FFF]/10'
                                : canSelect
                                  ? 'border-[#B44FFF]/20 bg-[#B44FFF]/5 hover:border-[#B44FFF]/40'
                                  : 'border-border/50 opacity-40 cursor-not-allowed',
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={cn('font-medium', isSelected || canSelect ? 'text-[#D4A0FF]' : 'text-muted-foreground')}>{card.name}</span>
                                {card.tier < round && (
                                  <span className="text-[8px] text-muted-foreground/60">T{card.tier}</span>
                                )}
                                <Badge variant="epic" className="text-[8px] px-1 py-0">Special</Badge>
                                {card.tag !== 'Standard' && (
                                  <Badge variant={card.tag === 'Chain' ? 'chain' : 'combo'} className="text-[8px] px-1 py-0">{card.tag}</Badge>
                                )}
                              </div>
                              <p className="mt-0.5 text-[10px] text-muted-foreground">{card.description}</p>
                            </div>
                            {isSelected && <span className="text-[10px] font-bold text-[#B44FFF] shrink-0">Selected</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Chip Selector ──
function ChipSelector({
  socket,
  recommended,
  selectedChips,
  onToggle,
  hasSkills,
}: {
  socket: ChipSocketData;
  recommended: (ChipStat & { score: number; reason: string })[];
  selectedChips: ChipStat[];
  onToggle: (stat: ChipStat) => void;
  hasSkills: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState('');
  const isFull = selectedChips.length >= SLOTS_PER_SOCKET;

  // Build sorted chip list: recommended on top, rest below
  const recSet = new Set(recommended.map(r => r.description));
  const nonRecommended = socket.stats
    .filter(s => !recSet.has(s.description))
    .map(s => ({ ...s, score: 0, reason: '' }));

  const filterLower = filter.toLowerCase();
  const filteredRecommended = filterLower
    ? recommended.filter(c => c.description.toLowerCase().includes(filterLower))
    : recommended;
  const filteredNonRecommended = filterLower
    ? nonRecommended.filter(c => c.description.toLowerCase().includes(filterLower))
    : nonRecommended;
  const allChips = [...filteredRecommended, ...filteredNonRecommended];

  return (
    <div className="rounded-lg border border-border bg-card/80 p-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-lg">{socket.icon}</span>
        <span className="text-sm font-semibold" style={{ color: socket.color }}>{socket.name}</span>
        <span className="ml-1 text-[10px] font-medium text-muted-foreground">{selectedChips.length}/{SLOTS_PER_SOCKET}</span>
        <ChevronDown className={cn('ml-auto h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
      </button>

      {/* Collapsed: show equipped chips summary */}
      {!expanded && selectedChips.length > 0 && (
        <div className="mt-2 space-y-1">
          {selectedChips.map((chip, i) => (
            <div key={i} className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground flex-1 truncate">{chip.description}</p>
              <button type="button" onClick={() => onToggle(chip)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 relative mb-2">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search chips..."
                className="w-full rounded-md border border-border bg-secondary px-2.5 py-1.5 pl-8 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
              />
              {filter && (
                <button type="button" aria-label="Clear filter" onClick={() => setFilter('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {hasSkills && filteredRecommended.length > 0 && (
                <p className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3" /> Recommended for your build
                </p>
              )}
              {allChips.map((chip, i) => {
                const isEquipped = selectedChips.some(s => s.description === chip.description);
                const isRecommended = chip.score > 0;
                const showDivider = i === filteredRecommended.length && filteredRecommended.length > 0;
                const disabled = !isEquipped && isFull;

                return (
                  <React.Fragment key={i}>
                    {showDivider && (
                      <p className="mt-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        All Chips
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onToggle(chip)}
                      className={cn(
                        'flex w-full items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors',
                        isEquipped
                          ? 'border-primary/50 bg-primary/10'
                          : disabled
                            ? 'border-border/50 opacity-40 cursor-not-allowed'
                            : 'border-border hover:border-primary/30 hover:bg-secondary',
                      )}
                    >
                      <div className="flex-1">
                        <p className={cn('text-foreground', isEquipped && 'text-primary')}>{chip.description}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {chip.chance}% drop
                          {chip.isUltraRare && <span className="ml-1 text-[#FFD700]">Ultra Rare</span>}
                          {isRecommended && <span className="ml-1" style={{ color: socket.color }}>&middot; {(chip as any).reason}</span>}
                        </p>
                      </div>
                      {isRecommended && (
                        <div className="flex shrink-0 gap-0.5 mt-0.5">
                          {Array.from({ length: Math.min(chip.score, 5) }, (_, j) => (
                            <Star key={j} className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700]" />
                          ))}
                        </div>
                      )}
                      {isEquipped && (
                        <span className="shrink-0 text-[10px] font-bold text-primary mt-0.5">Equipped</span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Screen ──
export function BuildPlannerScreen() {
  const fixedSkill = SKILLS.find(s => s.isFixed)!;
  const selectableSkills = SKILLS.filter(s => !s.isFixed);

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Record<string, SkillCard[]>>({});
  const [selectedChips, setSelectedChips] = useState<Record<string, ChipStat[]>>({});

  // All skills in the build: fixed + user-selected
  const allBuildSkills = [fixedSkill, ...selectedSkills];

  const excludedIds = selectedSkills.map(s => s.id);

  const recommendations = useMemo(() => {
    const rec: Record<string, (ChipStat & { score: number; reason: string })[]> = {};
    for (const socket of CHIP_SOCKETS) {
      rec[socket.id] = getRecommendedChips(allBuildSkills, socket);
    }
    return rec;
  }, [allBuildSkills]);

  const boosts = useMemo(() => getBoostSummary(allBuildSkills, selectedChips), [allBuildSkills, selectedChips]);

  // Detect combos that match selected skills
  const matchedCombos = useMemo(() => {
    if (allBuildSkills.length < 2) return [];
    const ids = new Set(allBuildSkills.map(s => s.id));
    return COMBOS
      .filter(c => c.skills.every(sid => ids.has(sid)))
      .sort((a, b) => b.rating - a.rating);
  }, [allBuildSkills]);

  const partialCombos = useMemo(() => {
    if (allBuildSkills.length < 2) return [];
    const ids = new Set(allBuildSkills.map(s => s.id));
    return COMBOS
      .filter(c => {
        const matchCount = c.skills.filter(sid => ids.has(sid)).length;
        return matchCount > 0 && matchCount < c.skills.length;
      })
      .map(c => {
        const missing = c.skills.filter(sid => !ids.has(sid));
        return { ...c, missing };
      })
      .sort((a, b) => b.rating - a.rating || a.missing.length - b.missing.length)
      .slice(0, 4);
  }, [selectedSkills]);

  const removeSkill = (id: string) => {
    setSelectedSkills(prev => prev.filter(s => s.id !== id));
    setSelectedCards(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const clearAll = () => {
    setSelectedSkills([]);
    setSelectedCards({});
    setSelectedChips({});
  };

  const totalSelectedCards = Object.values(selectedCards).flat().length;
  const totalEquippedChips = Object.values(selectedChips).flat().length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Swords className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Build Planner</h1>
              <p className="text-sm text-muted-foreground">
                Craft your loadout &middot; {1 + selectedSkills.length}/{1 + MAX_SKILLS} skills
              </p>
            </div>
          </div>
          {selectedSkills.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
            >
              Clear Build
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Skills + Chips */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Skill Slots */}
          <motion.div {...fadeUp(0.04)}>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /> Skill Loadout
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {/* Fixed Guardian Turret slot */}
              {(() => {
                const color = SkillTypeColors[fixedSkill.type];
                return (
                  <div
                    className="relative flex items-center gap-2.5 rounded-xl border p-2.5 pr-3.5"
                    style={{
                      borderColor: `${color}35`,
                      background: `linear-gradient(135deg, ${color}15, ${color}05 70%)`,
                      boxShadow: `0 0 20px ${color}08`,
                    }}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden"
                      style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
                      <SkillIcon skill={fixedSkill} size={44} />
                    </span>
                    <div>
                      <div className="text-[13px] font-bold text-foreground">{fixedSkill.name}</div>
                      <SkillTypeBadge type={fixedSkill.type} />
                    </div>
                  </div>
                );
              })()}

              {selectedSkills.map((skill, i) => {
                const color = SkillTypeColors[skill.type];
                return (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: TIMING.normal, ease: EASE.spring }}
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={EASE.bounce}
                      className="group relative flex items-center gap-2.5 rounded-xl border p-2.5 pr-3.5"
                      style={{
                        borderColor: `${color}35`,
                        background: `linear-gradient(135deg, ${color}15, ${color}05 70%)`,
                        boxShadow: `0 0 20px ${color}08`,
                      }}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden"
                        style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
                        <SkillIcon skill={skill} size={44} />
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-foreground">{skill.name}</div>
                        <SkillTypeBadge type={skill.type} />
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${skill.name}`}
                        onClick={() => removeSkill(skill.id)}
                        className="ml-1.5 rounded-full p-1 text-muted-foreground/40 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })}

              {selectedSkills.length < MAX_SKILLS && (
                <motion.button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(0,200,255,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-[62px] w-[62px] items-center justify-center rounded-xl border-2 border-dashed border-border/60 text-muted-foreground/50 transition-colors hover:text-primary"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Combo Detection */}
          {selectedSkills.length > 0 && (matchedCombos.length > 0 || partialCombos.length > 0) && (
            <motion.div {...fadeUp(0.08)}>
              {/* Active Combos */}
              {matchedCombos.length > 0 && (
                <div className="mb-4">
                  <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFD700]">
                    <Link2 className="h-3.5 w-3.5" /> Active Synergies
                  </h2>
                  <div className="space-y-2">
                    {matchedCombos.map(combo => (
                      <div
                        key={combo.id}
                        className="rounded-xl border border-[#FFD700]/20 p-4"
                        style={{ background: 'linear-gradient(135deg, #FFD70010, transparent 50%)', boxShadow: '0 0 30px #FFD70005' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={cn('h-3 w-3', i < combo.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border/30')} />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-foreground">{combo.name}</span>
                          {combo.rating === 5 && <Badge variant="mythic" className="text-[9px]">TOP BUILD</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{combo.synergy}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {combo.cards.map(card => (
                            <span key={card} className="rounded-md border border-[#B44FFF]/15 bg-[#B44FFF]/6 px-2 py-0.5 text-[10px] font-medium text-[#D4A0FF]">
                              {card}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Partial Combos */}
              {partialCombos.length > 0 && selectedSkills.length < MAX_SKILLS && (
                <div className="mb-4">
                  <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-primary" /> Possible Synergies
                  </h2>
                  <div className="space-y-2">
                    {partialCombos.map(combo => (
                      <div
                        key={combo.id}
                        className="rounded-xl border border-border/30 bg-card/40 p-3.5"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={cn('h-2.5 w-2.5', i < combo.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border/30')} />
                            ))}
                          </div>
                          <span className="text-[13px] font-semibold text-foreground">{combo.name}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-2">{combo.description}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">Add:</span>
                          {combo.missing.map(sid => {
                            const skill = SKILLS.find(s => s.id === sid);
                            if (!skill) return null;
                            const color = SkillTypeColors[skill.type];
                            return (
                              <button
                                key={sid}
                                type="button"
                                onClick={() => {
                                  if (selectedSkills.length < MAX_SKILLS && !selectedSkills.some(s => s.id === sid)) {
                                    setSelectedSkills(prev => [...prev, skill]);
                                  }
                                }}
                                className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors hover:brightness-125"
                                style={{ borderColor: `${color}30`, backgroundColor: `${color}08`, color }}
                              >
                                <Plus className="h-2.5 w-2.5" />
                                {skill.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Skill Cards */}
          {allBuildSkills.some(s => s.cards.length > 0) && (
            <motion.div {...fadeUp(0.12)}>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Upgrade Cards
              </h2>
              <p className="mb-3 text-[11px] text-muted-foreground leading-relaxed">
                Select 3 normal cards per tier to unlock 1 special card. Complete a tier to advance.
              </p>
              <div className="space-y-2">
                {allBuildSkills.filter(s => s.cards.length > 0).map(skill => (
                  <SkillCardSelector
                    key={skill.id}
                    skill={skill}
                    selectedCards={selectedCards[skill.id] || []}
                    onToggleCard={card => {
                      setSelectedCards(prev => {
                        const current = prev[skill.id] || [];
                        const exists = current.some(c => c.name === card.name && c.tier === card.tier);
                        if (exists) {
                          return { ...prev, [skill.id]: current.filter(c => !(c.name === card.name && c.tier === card.tier)) };
                        }
                        return { ...prev, [skill.id]: [...current, card] };
                      });
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Chip Sockets */}
          {selectedSkills.length > 0 && (
            <motion.div {...fadeUp(0.16)}>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Chip Sockets
              </h2>
              <div className="space-y-2">
                {CHIP_SOCKETS.map(socket => (
                  <ChipSelector
                    key={socket.id}
                    socket={socket}
                    recommended={recommendations[socket.id] || []}
                    selectedChips={selectedChips[socket.id] || []}
                    onToggle={stat => {
                      setSelectedChips(prev => {
                        const current = prev[socket.id] || [];
                        const exists = current.some(c => c.description === stat.description);
                        if (exists) return { ...prev, [socket.id]: current.filter(c => c.description !== stat.description) };
                        if (current.length >= SLOTS_PER_SOCKET) return prev;
                        return { ...prev, [socket.id]: [...current, stat] };
                      });
                    }}
                    hasSkills={allBuildSkills.length > 0}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Build Summary */}
        <div className="w-full lg:w-[300px] lg:shrink-0 lg:ml-auto">
          <div className="sticky top-8">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Build Summary
            </h2>
            <Card className="overflow-hidden" style={{ border: '1px solid hsl(225 12% 14%)', background: 'linear-gradient(180deg, hsl(225 15% 8%), hsl(225 15% 6%))' }}>
              <CardContent className="p-5">
                {selectedSkills.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                    <Swords className="h-10 w-10 opacity-15" />
                    <p className="text-sm text-center leading-relaxed">Select skills to start<br />building your loadout.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Skill Loadout */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Skill Loadout</p>
                      <div className="flex flex-wrap gap-1.5">
                        {allBuildSkills.map(s => {
                          const color = SkillTypeColors[s.type];
                          return (
                            <span key={s.id} className="flex items-center gap-1.5 rounded-lg border px-2 py-1"
                              style={{ borderColor: `${color}25`, background: `${color}08` }}>
                              <SkillIcon skill={s} size={16} />
                              <span className="text-[11px] font-medium text-foreground">{s.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active synergies with tooltips */}
                    {matchedCombos.length > 0 && (
                      <div>
                        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#FFD700]">
                          Active Synergies ({matchedCombos.length})
                        </p>
                        <div className="space-y-1.5">
                          {matchedCombos.map(c => (
                            <Tooltip
                              key={c.id}
                              side="left"
                              content={
                                <div>
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <div className="flex gap-0.5">
                                      {Array.from({ length: 5 }, (_, i) => (
                                        <Star key={i} className={cn('h-2.5 w-2.5', i < c.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border/30')} />
                                      ))}
                                    </div>
                                    <span className="font-bold text-[12px]">{c.name}</span>
                                    {c.rating === 5 && <span className="text-[8px] font-bold text-[#FFD700]">TOP</span>}
                                  </div>
                                  <p className="text-muted-foreground mb-2">{c.synergy}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {c.cards.map(card => (
                                      <span key={card} className="rounded border border-[#B44FFF]/20 bg-[#B44FFF]/8 px-1.5 py-0.5 text-[9px] font-medium text-[#D4A0FF]">{card}</span>
                                    ))}
                                  </div>
                                  <p className="text-muted-foreground/50 mt-2 text-[9px]">{c.playstyle}</p>
                                </div>
                              }
                            >
                              <div className="flex items-center gap-2 rounded-lg border border-[#FFD700]/10 bg-[#FFD700]/4 px-2.5 py-1.5 cursor-default transition-all hover:border-[#FFD700]/25 hover:bg-[#FFD700]/8">
                                <div className="flex gap-0.5">
                                  {Array.from({ length: c.rating }, (_, i) => (
                                    <Star key={i} className="h-2 w-2 fill-[#FFD700] text-[#FFD700]" />
                                  ))}
                                </div>
                                <span className="text-[11px] font-medium text-foreground">{c.name}</span>
                              </div>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected cards */}
                    {totalSelectedCards > 0 && (
                      <div>
                        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Cards ({totalSelectedCards})
                        </p>
                        {allBuildSkills.map(skill => {
                          const cards = selectedCards[skill.id] || [];
                          if (cards.length === 0) return null;
                          const color = SkillTypeColors[skill.type];
                          return (
                            <div key={skill.id} className="mb-2.5">
                              <p className="text-[10px] font-semibold mb-1" style={{ color }}>{skill.name}</p>
                              <div className="ml-2.5 space-y-0.5">
                                {cards.map((c, i) => (
                                  <Tooltip
                                    key={i}
                                    side="left"
                                    content={
                                      <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <span className="font-semibold">{c.name}</span>
                                          {c.isSpecial && <span className="text-[9px] text-[#D4A0FF] font-semibold">Special</span>}
                                          {c.tag !== 'Standard' && (
                                            <span className={`text-[9px] font-semibold ${c.tag === 'Chain' ? 'text-[#00C8FF]' : 'text-[#FF6B9D]'}`}>{c.tag}</span>
                                          )}
                                        </div>
                                        <p className="text-muted-foreground">{c.description}</p>
                                        <p className="text-muted-foreground/50 mt-1 text-[9px]">Tier {c.tier}</p>
                                      </div>
                                    }
                                  >
                                    <p className={cn('text-[10px] truncate cursor-default transition-colors hover:text-foreground', c.isSpecial ? 'text-[#D4A0FF] font-medium' : 'text-secondary-foreground')}>
                                      {c.isSpecial ? '★ ' : '• '}{c.name}
                                    </p>
                                  </Tooltip>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Chip Sockets — 6 square grid */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Chips ({totalEquippedChips}/{CHIP_SOCKETS.length * SLOTS_PER_SOCKET})
                      </p>
                      <div className="grid grid-cols-6 gap-1.5">
                        {CHIP_SOCKETS.map(socket => {
                          const chips = selectedChips[socket.id] || [];
                          const filled = chips.length;
                          return (
                            <Tooltip
                              key={socket.id}
                              side="left"
                              content={
                                <div>
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-sm">{socket.icon}</span>
                                    <span className="font-semibold text-[12px]" style={{ color: socket.color }}>{socket.name}</span>
                                    <span className="text-muted-foreground text-[10px]">{filled}/{SLOTS_PER_SOCKET}</span>
                                  </div>
                                  {chips.length > 0 ? (
                                    <div className="space-y-1">
                                      {chips.map((chip, i) => (
                                        <div key={i} className="flex items-start gap-1.5">
                                          <span className="text-muted-foreground/50 mt-px">•</span>
                                          <div>
                                            <p className="text-foreground">{chip.description}</p>
                                            <p className="text-muted-foreground/50 text-[9px]">{chip.chance}% drop{chip.isUltraRare ? ' · Ultra Rare' : ''}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">No chips equipped</p>
                                  )}
                                </div>
                              }
                            >
                              <div className="flex flex-col items-center gap-1 cursor-default">
                                {/* Socket square */}
                                <div
                                  className="relative h-10 w-full rounded-lg border transition-all hover:brightness-125"
                                  style={{
                                    borderColor: `${socket.color}${filled > 0 ? '40' : '18'}`,
                                    background: `linear-gradient(135deg, ${socket.color}${filled > 0 ? '18' : '06'}, transparent)`,
                                  }}
                                >
                                  <span className="absolute inset-0 flex items-center justify-center text-lg">{socket.icon}</span>
                                  {/* Fill indicator dots */}
                                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                    {Array.from({ length: SLOTS_PER_SOCKET }, (_, i) => (
                                      <div
                                        key={i}
                                        className="h-1 w-1 rounded-full"
                                        style={{ backgroundColor: i < filled ? socket.color : `${socket.color}20` }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-[8px] text-muted-foreground truncate w-full text-center">{socket.name}</span>
                              </div>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>

                    {/* Boosts */}
                    {boosts.length > 0 && (
                      <div>
                        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Boosts</p>
                        <div className="space-y-1.5">
                          {boosts.map((b, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/50 px-3 py-2">
                              <span className="text-[11px] text-secondary-foreground truncate mr-2">{b.label}</span>
                              <span className="text-[11px] font-bold shrink-0" style={{ color: b.color }}>{b.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Skill Picker Modal */}
      <AnimatePresence>
        <SkillPicker
          open={pickerOpen}
          selected={selectedSkills}
          onToggle={skill => {
            setSelectedSkills(prev => {
              const exists = prev.some(s => s.id === skill.id);
              if (exists) {
                setSelectedCards(pc => { const next = { ...pc }; delete next[skill.id]; return next; });
                return prev.filter(s => s.id !== skill.id);
              }
              if (prev.length >= MAX_SKILLS) return prev;
              return [...prev, skill];
            });
          }}
          onClose={() => setPickerOpen(false)}
        />
      </AnimatePresence>
    </div>
  );
}
