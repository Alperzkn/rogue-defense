import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Link, Heart, Lightbulb, ChevronRight, Star, Info, X, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { SkillTypeBadge, SkillIcon } from '../components';
import { Tooltip } from '../components/ui/tooltip';
import { SKILLS, COMBOS } from '../data';
import { SkillTypeColors } from '../theme/colors';
import type { Skill, SkillCard, CardTier } from '../data/types';
import { fadeUp, TIMING, EASE } from '../lib/animations';

const TIER_CONFIG: Record<CardTier, { label: string; color: string; desc: string }> = {
  1: { label: 'Initial',     color: '#7AB8D4', desc: 'Available from the start' },
  2: { label: 'Star Tier 2', color: '#FFD700', desc: 'Unlocked at star upgrade' },
  3: { label: 'Star Tier 3', color: '#B44FFF', desc: 'Pinnacle upgrades' },
};

// ── Mini card used inside the modal flow ──
function MiniCard({ card, highlighted, onClick }: { card: SkillCard; highlighted?: boolean; onClick?: () => void }) {
  const tier = TIER_CONFIG[card.tier];
  const isChain = card.tag === 'Chain';
  const isCombo = card.tag === 'Combo';
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border px-3 py-2 text-left transition-all',
        onClick && 'cursor-pointer hover:brightness-125',
        highlighted && 'ring-2 ring-primary/50',
        card.isSpecial && 'border-[#B44FFF]/30 bg-[#B44FFF]/10',
        isChain && !card.isSpecial && 'border-[#00C8FF]/25 bg-[#00C8FF]/8',
        isCombo && !card.isSpecial && 'border-[#FF6B9D]/25 bg-[#FF6B9D]/8',
        !isChain && !isCombo && !card.isSpecial && 'border-border/50 bg-secondary/30',
      )}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={cn('text-[11px] font-semibold truncate', card.isSpecial ? 'text-[#D4A0FF]' : 'text-foreground')}>{card.name}</span>
        {card.isSpecial && <Badge variant="epic" className="text-[7px]">S</Badge>}
        {isChain && <Badge variant="chain" className="text-[7px]">C</Badge>}
        {isCombo && <Badge variant="combo" className="text-[7px]">Co</Badge>}
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{card.description}</p>
      <span className="mt-1 inline-block text-[9px] font-semibold" style={{ color: tier.color }}>{tier.label}</span>
    </div>
  );
}

// ── Card Detail Modal ──
function CardDetailModal({ card, skill, onClose, onSelectCard }: {
  card: SkillCard;
  skill: Skill;
  onClose: () => void;
  onSelectCard: (c: SkillCard) => void;
}) {
  const tier = TIER_CONFIG[card.tier];
  const isChain = card.tag === 'Chain';
  const isCombo = card.tag === 'Combo';

  // Build chain flow: group chain cards by tier, showing dependency
  const chainCards = skill.cards.filter(c => c.tag === 'Chain');
  const chainTiers = [1, 2, 3] as CardTier[];

  // Find cards that require this card
  const dependents = skill.cards.filter(c => c.requiresCards?.includes(card.name));
  // Find cards this card requires
  const prerequisites = card.requiresCards
    ? skill.cards.filter(c => card.requiresCards!.includes(c.name))
    : [];

  // Combo cards for this skill
  const comboCards = skill.cards.filter(c => c.tag === 'Combo');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card p-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={cn('text-lg font-bold', card.isSpecial ? 'text-[#D4A0FF]' : 'text-foreground')}>{card.name}</h3>
              {card.isSpecial && <Badge variant="epic" className="text-[8px]">Special</Badge>}
              {card.tag !== 'Standard' && (
                <Badge variant={isChain ? 'chain' : 'combo'} className="text-[8px]">{card.tag}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold" style={{ color: tier.color }}>{tier.label}</span>
              <span className="text-[10px] text-muted-foreground">&middot; {skill.name}</span>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">{card.description}</p>

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Requires</p>
            <div className="flex flex-wrap gap-2">
              {prerequisites.map(c => (
                <MiniCard key={c.name} card={c} onClick={() => onSelectCard(c)} />
              ))}
            </div>
            <div className="flex justify-center my-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground/30" />
            </div>
          </div>
        )}

        {/* Chain Flow Visualization */}
        {isChain && chainCards.length > 1 && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Link className="inline h-3 w-3 text-[#00C8FF] mr-1" />
              Chain Flow
            </p>
            <div className="flex flex-col gap-1.5">
              {chainTiers.map(t => {
                const tierCards = chainCards.filter(c => c.tier === t);
                if (tierCards.length === 0) return null;
                return (
                  <div key={t}>
                    <div className="flex flex-wrap gap-1.5">
                      {tierCards.map(c => (
                        <div key={c.name} className="flex-1 min-w-[140px]">
                          <MiniCard
                            card={c}
                            highlighted={c.name === card.name}
                            onClick={c.name !== card.name ? () => onSelectCard(c) : undefined}
                          />
                        </div>
                      ))}
                    </div>
                    {t < 3 && chainCards.some(c => c.tier > t) && (
                      <div className="flex justify-center my-1.5">
                        <ArrowDown className="h-3.5 w-3.5 text-[#00C8FF]/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Combo Cards Visualization */}
        {isCombo && comboCards.length > 1 && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Heart className="inline h-3 w-3 text-[#FF6B9D] mr-1" />
              Combo Cards
            </p>
            <div className="flex flex-wrap gap-1.5">
              {comboCards.map(c => (
                <div key={c.name} className="flex-1 min-w-[140px]">
                  <MiniCard
                    card={c}
                    highlighted={c.name === card.name}
                    onClick={c.name !== card.name ? () => onSelectCard(c) : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dependents */}
        {dependents.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-center mb-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Unlocks</p>
            <div className="flex flex-wrap gap-2">
              {dependents.map(c => (
                <MiniCard key={c.name} card={c} onClick={() => onSelectCard(c)} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CardItem({ card, index, onClick }: { card: SkillCard; index: number; onClick?: () => void }) {
  const isChain = card.tag === 'Chain';
  const isCombo = card.tag === 'Combo';
  const isSpecial = card.isSpecial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: TIMING.normal, delay: index * 0.03, ease: EASE.spring }}
    >
      <div
        onClick={onClick}
        className={cn(
        'flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 hover:brightness-110 cursor-pointer',
        isSpecial && 'border-[#B44FFF]/30 bg-gradient-to-br from-[#B44FFF]/12 to-[#FF6B9D]/6',
        isChain && !isSpecial && 'border-[#00C8FF]/25 bg-[#00C8FF]/8',
        isCombo && !isSpecial && 'border-[#FF6B9D]/25 bg-[#FF6B9D]/8',
        !isChain && !isCombo && !isSpecial && 'border-border/50 bg-secondary/40',
      )}>
        {(isChain || isCombo) && (
          <div className="mt-0.5 shrink-0">
            {isChain ? <Link className="h-3.5 w-3.5 text-[#00C8FF]/70" /> : <Heart className="h-3.5 w-3.5 text-[#FF6B9D]/70" />}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className={cn('text-[13px] font-semibold leading-tight', isSpecial ? 'text-[#D4A0FF]' : 'text-foreground')}>{card.name}</span>
            <div className="flex items-center gap-1 shrink-0">
              {isSpecial && (
                <Tooltip content="Enhanced/rare variant — purple background in-game">
                  <span><Badge variant="epic" className="text-[8px] cursor-default">Special</Badge></span>
                </Tooltip>
              )}
              {card.tag === 'Chain' && (
                <Tooltip content="Requires other cards from the same skill">
                  <span><Badge variant="chain" className="text-[8px] cursor-default">Chain</Badge></span>
                </Tooltip>
              )}
              {card.tag === 'Combo' && (
                <Tooltip content="Requires another skill in your build">
                  <span><Badge variant="combo" className="text-[8px] cursor-default">Combo</Badge></span>
                </Tooltip>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed">{card.description}</p>
          {card.lockedLevel && (
            <span className="mt-2 inline-block rounded-md border border-[#FFD700]/20 bg-[#FFD700]/8 px-2 py-0.5 text-[10px] font-semibold text-[#FFD700]">
              Unlocks at Lv.{card.lockedLevel}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function SkillDetailScreen() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const skill = SKILLS.find(s => s.id === skillId);
  const [selectedCard, setSelectedCard] = useState<SkillCard | null>(null);

  if (!skill) return (
    <div className="flex h-full items-center justify-center text-muted-foreground">Skill not found.</div>
  );

  const typeColor = SkillTypeColors[skill.type];
  const tiers: CardTier[] = [1, 2, 3];
  const relatedCombos = COMBOS.filter(c => c.skills.includes(skill.id));
  const chainCards = skill.cards.filter(c => c.tag === 'Chain');
  const comboCards = skill.cards.filter(c => c.tag === 'Combo');
  const specialCards = skill.cards.filter(c => c.isSpecial);
  const hasTips = skill.tips && skill.tips.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">

      {/* Breadcrumb */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <button
          type="button"
          onClick={() => navigate('/skills')}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Skills</span>
        </button>
      </motion.div>

      {/* Two-column layout */}
      <div className={cn('flex flex-col gap-8 items-start', hasTips ? 'lg:grid lg:grid-cols-[1fr_260px]' : '')}>

        {/* Left: main content */}
        <div className="min-w-0">

          {/* Hero */}
          <motion.div {...fadeUp(0.03)} className="mb-8">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center text-3xl overflow-hidden ${skill.iconImage ? 'rounded-full' : 'rounded-xl'}`}
                style={{ backgroundColor: `${typeColor}10`, border: `1px solid ${typeColor}20` }}
              >
                <SkillIcon skill={skill} size={skill.iconImage ? 56 : 30} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">{skill.name}</h1>
                  <Tooltip content={`${skill.type.charAt(0).toUpperCase() + skill.type.slice(1)} damage type`}>
                    <span><SkillTypeBadge type={skill.type} /></span>
                  </Tooltip>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{skill.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tiers.map(t => {
                    const count = skill.cards.filter(c => c.tier === t).length;
                    const { label, color, desc } = TIER_CONFIG[t];
                    return (
                      <Tooltip key={t} content={desc}>
                        <div className="flex items-center gap-1.5 rounded-md border border-border/40 bg-secondary/30 px-2.5 py-1 cursor-default">
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-[11px] text-muted-foreground">{label}</span>
                          <span className="text-[11px] font-bold" style={{ color }}>{count}</span>
                        </div>
                      </Tooltip>
                    );
                  })}
                  <Separator orientation="vertical" className="h-5 self-center opacity-30 hidden sm:block" />
                  <Tooltip content="Chain cards — require other cards from the same skill">
                    <div className="flex items-center gap-1 rounded-md border border-[#00C8FF]/15 bg-[#00C8FF]/5 px-2.5 py-1 cursor-default">
                      <Link className="h-3 w-3 text-[#00C8FF]" />
                      <span className="text-[11px] font-bold text-[#00C8FF]">{chainCards.length}</span>
                    </div>
                  </Tooltip>
                  <Tooltip content="Combo cards — require another skill in your build">
                    <div className="flex items-center gap-1 rounded-md border border-[#FF6B9D]/15 bg-[#FF6B9D]/5 px-2.5 py-1 cursor-default">
                      <Heart className="h-3 w-3 text-[#FF6B9D]" />
                      <span className="text-[11px] font-bold text-[#FF6B9D]">{comboCards.length}</span>
                    </div>
                  </Tooltip>
                  {specialCards.length > 0 && (
                    <Tooltip content="Special cards — enhanced/rare variants (purple in-game)">
                      <div className="flex items-center gap-1 rounded-md border border-[#B44FFF]/15 bg-[#B44FFF]/5 px-2.5 py-1 cursor-default">
                        <Star className="h-3 w-3 text-[#B44FFF]" />
                        <span className="text-[11px] font-bold text-[#B44FFF]">{specialCards.length}</span>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards by tier */}
          <motion.div {...fadeUp(0.06)} className="mb-8">
            <Tabs defaultValue="1">
              <TabsList className="mb-5 w-full">
                {tiers.map(t => {
                  const { label, color } = TIER_CONFIG[t];
                  const count = skill.cards.filter(c => c.tier === t).length;
                  return (
                    <TabsTrigger key={t} value={String(t)} className="flex-1 gap-2">
                      <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                      {label}
                      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{count}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tiers.map(t => {
                const cards = skill.cards.filter(c => c.tier === t);
                const { desc } = TIER_CONFIG[t];
                return (
                  <TabsContent key={t} value={String(t)}>
                    <p className="mb-4 text-[11px] text-muted-foreground">{desc}</p>
                    <div className="flex flex-col gap-2">
                      {cards.map((card, i) => <CardItem key={`${card.name}-${card.tier}`} card={card} index={i} onClick={() => setSelectedCard(card)} />)}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </motion.div>

          {/* Related Combos */}
          {relatedCombos.length > 0 && (
            <motion.div {...fadeUp(0.09)}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Synergy Builds
              </h2>
              <div className="flex flex-col gap-2">
                {relatedCombos.map(combo => (
                  <motion.div key={combo.id} whileHover={{ x: 2 }} transition={EASE.bounce}>
                    <Card
                      onClick={() => navigate('/combos')}
                      className="cursor-pointer border-border/40 transition-all duration-200 hover:border-border/80"
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={cn('h-3 w-3', i < combo.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border')} />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-foreground">{combo.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{combo.synergy}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Pro Tips */}
        {hasTips && (
          <motion.div {...fadeUp(0.06)} className="sticky top-8">
            <div className="rounded-xl border border-border/40 bg-card/60 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
                <Lightbulb className="h-3.5 w-3.5 text-[#FFD700]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFD700]">Pro Tips</span>
              </div>
              <div className="flex flex-col divide-y divide-border/20">
                {skill.tips!.map((tip, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3.5">
                    <span className="mt-0.5 text-[11px] font-bold text-muted-foreground/40 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal
            card={selectedCard}
            skill={skill}
            onClose={() => setSelectedCard(null)}
            onSelectCard={c => setSelectedCard(c)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
