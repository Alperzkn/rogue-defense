import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Star, Zap, Gamepad2, CreditCard, Lightbulb, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { SkillTypeBadge } from '../components';
import { COMBOS, SKILLS } from '../data';
import { SkillTypeColors } from '../theme/colors';
import type { Combo } from '../data/types';

function SkillPill({ skillId, onClick }: { skillId: string; onClick?: () => void }) {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return null;
  const color = SkillTypeColors[skill.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors duration-150 hover:opacity-80"
      style={{ borderColor: `${color}40`, backgroundColor: `${color}12`, color }}
    >
      <span>{skill.icon}</span>
      <span>{skill.name}</span>
      <SkillTypeBadge type={skill.type} />
    </button>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('h-3.5 w-3.5', i < rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border')}
          style={i < rating ? { filter: 'drop-shadow(0 0 3px #FFD70080)' } : {}}
        />
      ))}
    </div>
  );
}

function ComboCard({ combo, index }: { combo: Combo; index: number }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isTop = combo.rating === 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn(
        'relative overflow-hidden border-border/60 bg-card/80 transition-all duration-200',
        isTop && 'border-[#B44FFF]/20 hover:border-[#B44FFF]/40',
        !isTop && 'hover:border-border/80',
      )}>
        {isTop && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #B44FFF0D, #00C8FF06, transparent)' }}
          />
        )}

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="relative w-full text-left"
          aria-label={`Toggle ${combo.name} details`}
        >
          <CardContent className="p-4">
            <div className="mb-2 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                  <StarRow rating={combo.rating} />
                  {isTop && <Badge variant="mythic">TOP BUILD</Badge>}
                </div>
                <h3 className={cn(
                  'text-base font-bold leading-tight',
                  isTop ? 'text-[#B44FFF]' : 'text-foreground',
                )}>
                  {combo.name}
                </h3>
              </div>
              <ChevronDown className={cn(
                'mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                open && 'rotate-180',
              )} />
            </div>

            <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{combo.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {combo.skills.map(id => (
                <SkillPill
                  key={id}
                  skillId={id}
                  onClick={() => navigate(`/skills/${id}`)}
                />
              ))}
            </div>
          </CardContent>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Separator />
              <CardContent className="p-4 pt-4">
                <div className="flex flex-col gap-4">

                  {/* Synergy */}
                  <div>
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Zap className="h-3.5 w-3.5 text-[#FFD700]" /> Synergy
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{combo.synergy}</p>
                  </div>

                  <Separator />

                  {/* Playstyle */}
                  <div>
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Gamepad2 className="h-3.5 w-3.5 text-[#00C8FF]" /> Playstyle
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{combo.playstyle}</p>
                  </div>

                  <Separator />

                  {/* Key Cards */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5 text-[#B44FFF]" /> Key Cards
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {combo.cards.map(card => (
                        <span
                          key={card}
                          className="rounded border border-[#B44FFF]/30 bg-[#B44FFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#B44FFF]"
                        >
                          {card}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  {combo.tips.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <Lightbulb className="h-3.5 w-3.5 text-[#FFD700]" /> Tips
                        </div>
                        <div className="flex flex-col gap-2">
                          {combo.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00C8FF]" />
                              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function CombosScreen() {
  const sorted = [...COMBOS].sort((a, b) => b.rating - a.rating);
  const topCount = sorted.filter(c => c.rating === 5).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Synergy Builds</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {COMBOS.length} curated builds · {topCount} top-rated (5★) · Click skill pills to view details
        </p>
      </div>

      {/* Legend */}
      <Card className="mb-6 border-border/60 bg-card/80">
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</span>
          {[5, 4, 3].map(r => (
            <div key={r} className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn('h-3 w-3', i < r ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border')} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {r === 5 ? 'Meta defining' : r === 4 ? 'Strong' : 'Viable'}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Combo list */}
      <div className="flex flex-col gap-3">
        {sorted.map((combo, i) => (
          <ComboCard key={combo.id} combo={combo} index={i} />
        ))}
      </div>
    </div>
  );
}
