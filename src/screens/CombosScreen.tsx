import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Star, Zap, Gamepad2, Layers, Lightbulb, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { SkillTypeBadge, SkillIcon } from '../components';
import { Tooltip } from '../components/ui/tooltip';
import { COMBOS, SKILLS } from '../data';
import { SkillTypeColors } from '../theme/colors';
import type { Combo } from '../data/types';
import { fadeUp, TIMING, EASE } from '../lib/animations';
import { useDocumentTitle } from '../lib/useDocumentTitle';

function getComboColor(combo: Combo): string {
  const skills = combo.skills.map(id => SKILLS.find(s => s.id === id)).filter(Boolean);
  if (skills.length === 0) return '#00C8FF';
  // Use the first skill's type color as the dominant accent
  return SkillTypeColors[skills[0]!.type];
}

function SkillPill({ skillId, onClick }: { skillId: string; onClick?: () => void }) {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return null;
  const color = SkillTypeColors[skill.type];

  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 hover:brightness-125"
      style={{ borderColor: `${color}25`, backgroundColor: `${color}08` }}
    >
      <SkillIcon skill={skill} size={16} />
      <span className="text-foreground">{skill.name}</span>
      <Tooltip content={`${skill.type.charAt(0).toUpperCase() + skill.type.slice(1)} damage type`}>
        <span><SkillTypeBadge type={skill.type} /></span>
      </Tooltip>
    </button>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('h-3 w-3', i < rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border/50')}
        />
      ))}
    </div>
  );
}

function ComboCard({ combo, index }: { combo: Combo; index: number }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isTop = combo.rating === 5;
  const accentColor = getComboColor(combo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: TIMING.normal, delay: index * TIMING.stagger, ease: EASE.spring }}
    >
      <Card
        className="group relative overflow-hidden transition-all duration-200 hover:brightness-110"
        style={{
          border: `1px solid ${accentColor}35`,
          background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10 50%, hsl(var(--card)) 100%)`,
        }}
      >

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="relative w-full text-left"
          aria-label={`Toggle ${combo.name} details`}
        >
          <CardContent className="p-5 pl-5">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex items-center gap-2.5 flex-wrap">
                  <Tooltip content={`${combo.rating}/5 — ${combo.rating === 5 ? 'Meta defining' : combo.rating === 4 ? 'Strong' : 'Viable'}`}>
                    <div className="cursor-default"><StarRow rating={combo.rating} /></div>
                  </Tooltip>
                  {isTop && (
                    <Tooltip content="Meta-defining build — highest effectiveness rating">
                      <span><Badge variant="mythic" className="text-[9px] cursor-default">TOP BUILD</Badge></span>
                    </Tooltip>
                  )}
                </div>
                <h3 className="text-[15px] font-bold text-foreground leading-tight mb-2">
                  {combo.name}
                </h3>
                <p className="mb-3 text-[12px] text-muted-foreground leading-relaxed">{combo.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {combo.skills.map(id => (
                    <SkillPill key={id} skillId={id} onClick={() => navigate(`/skills/${id}`)} />
                  ))}
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
              <div className="mx-5 ml-5 h-px bg-border/30" />
              <CardContent className="p-5 pl-5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Synergy */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: `${accentColor}12` }}>
                        <Zap className="h-3 w-3" style={{ color: accentColor }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Synergy</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{combo.synergy}</p>
                  </div>

                  {/* Playstyle */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/8">
                        <Gamepad2 className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Playstyle</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{combo.playstyle}</p>
                  </div>
                </div>

                {/* Key Cards */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#B44FFF]/8">
                      <Layers className="h-3 w-3 text-[#B44FFF]" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Key Cards</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {combo.cards.map(cardName => {
                      const skillData = combo.skills.map(id => SKILLS.find(s => s.id === id)).filter(Boolean);
                      const cardData = skillData.flatMap(s => s!.cards).find(c => c.name === cardName);
                      const fromSkill = skillData.find(s => s!.cards.some(c => c.name === cardName));
                      const tipContent = cardData
                        ? <div><div className="font-semibold mb-1">{cardName}</div><p className="text-muted-foreground">{cardData.description}</p>{fromSkill && <p className="text-muted-foreground/50 mt-1 text-[9px]">From: {fromSkill.name} &middot; Tier {cardData.tier}</p>}</div>
                        : cardName;
                      return (
                      <Tooltip key={cardName} content={tipContent}>
                      <span
                        className="rounded-md border border-[#B44FFF]/15 bg-[#B44FFF]/6 px-2.5 py-1 text-[11px] font-medium text-[#D4A0FF] cursor-default"
                      >
                        {cardName}
                      </span>
                      </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                {combo.tips.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-[#FFD700]/8">
                        <Lightbulb className="h-3 w-3 text-[#FFD700]" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tips</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {combo.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/40" />
                          <p className="text-[12px] text-muted-foreground leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function CombosScreen() {
  useDocumentTitle('Synergy Builds');
  const sorted = [...COMBOS].sort((a, b) => b.rating - a.rating);
  const topCount = sorted.filter(c => c.rating === 5).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Synergy Builds</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {COMBOS.length} curated builds &middot; {topCount} top-rated (5★)
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div {...fadeUp(0.04)} className="mb-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border/30 bg-card/40 px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Rating</span>
          {[
            { rating: 5, label: 'Meta defining' },
            { rating: 4, label: 'Strong' },
            { rating: 3, label: 'Viable' },
          ].map(({ rating, label }) => (
            <div key={rating} className="flex items-center gap-2">
              <StarRow rating={rating} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Combo list */}
      <div className="flex flex-col gap-3">
        {sorted.map((combo, i) => (
          <ComboCard key={combo.id} combo={combo} index={i} />
        ))}
      </div>
    </div>
  );
}
