import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Link, Heart, Lightbulb, ChevronRight, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { SkillTypeBadge } from '../components';
import { SKILLS, COMBOS } from '../data';
import { SkillTypeColors } from '../theme/colors';
import type { SkillCard, CardTier } from '../data/types';

const TIER_CONFIG: Record<CardTier, { label: string; color: string; desc: string }> = {
  1: { label: 'Initial',     color: '#7AB8D4', desc: 'Available from the start' },
  2: { label: 'Star Tier 2', color: '#FFD700', desc: 'Unlocked at star upgrade' },
  3: { label: 'Star Tier 3', color: '#B44FFF', desc: 'Pinnacle upgrades' },
};

function CardItem({ card }: { card: SkillCard }) {
  const isChain = card.tag === 'Chain';
  const isCombo = card.tag === 'Combo';

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-lg border p-3.5 transition-colors',
      isChain && 'border-[#00C8FF]/20 bg-[#00C8FF]/5',
      isCombo && 'border-[#FF6B9D]/20 bg-[#FF6B9D]/5',
      !isChain && !isCombo && 'border-border bg-secondary/30',
    )}>
      {(isChain || isCombo) && (
        <div className="mt-0.5 shrink-0">
          {isChain ? <Link className="h-3.5 w-3.5 text-[#00C8FF]" /> : <Heart className="h-3.5 w-3.5 text-[#FF6B9D]" />}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground leading-tight">{card.name}</span>
          {card.tag !== 'Standard' && (
            <Badge variant={card.tag === 'Chain' ? 'chain' : 'combo'} className="shrink-0">
              {card.tag}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{card.description}</p>
        {card.lockedLevel && (
          <span className="mt-1.5 inline-block rounded border border-[#FFD700]/30 bg-[#FFD700]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#FFD700]">
            Unlocks at Lv.{card.lockedLevel}
          </span>
        )}
      </div>
    </div>
  );
}

export function SkillDetailScreen() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const skill = SKILLS.find(s => s.id === skillId);

  if (!skill) return (
    <div className="flex h-full items-center justify-center text-muted-foreground">Skill not found.</div>
  );

  const typeColor = SkillTypeColors[skill.type];
  const tiers: CardTier[] = [1, 2, 3];
  const relatedCombos = COMBOS.filter(c => c.skills.includes(skill.id));
  const chainCards = skill.cards.filter(c => c.tag === 'Chain');
  const comboCards = skill.cards.filter(c => c.tag === 'Combo');
  const hasTips = skill.tips && skill.tips.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">

      {/* Breadcrumb — full width */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <button type="button" onClick={() => navigate('/skills')} className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Skills
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{skill.name}</span>
      </div>

      {/* Two-column layout */}
      <div className={cn('flex gap-6 items-start', hasTips ? 'grid grid-cols-[1fr_260px]' : '')}>

        {/* ── Left: main content ── */}
        <div className="min-w-0">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 overflow-hidden rounded-xl border"
            style={{ borderColor: `${typeColor}30`, background: `linear-gradient(135deg, ${typeColor}12, hsl(var(--card)) 60%)` }}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl"
                  style={{ backgroundColor: `${typeColor}18`, border: `1px solid ${typeColor}40` }}
                >
                  {skill.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-black text-foreground">{skill.name}</h1>
                    <SkillTypeBadge type={skill.type} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{skill.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tiers.map(t => {
                      const count = skill.cards.filter(c => c.tier === t).length;
                      const { label, color } = TIER_CONFIG[t];
                      return (
                        <div key={t} className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1">
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-xs text-muted-foreground">{label}:</span>
                          <span className="text-xs font-bold" style={{ color }}>{count}</span>
                        </div>
                      );
                    })}
                    <Separator orientation="vertical" className="h-6 self-center" />
                    <div className="flex items-center gap-1 rounded-md border border-[#00C8FF]/30 bg-[#00C8FF]/8 px-2.5 py-1">
                      <Link className="h-3 w-3 text-[#00C8FF]" />
                      <span className="text-xs font-bold text-[#00C8FF]">{chainCards.length} Chain</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-md border border-[#FF6B9D]/30 bg-[#FF6B9D]/8 px-2.5 py-1">
                      <Heart className="h-3 w-3 text-[#FF6B9D]" />
                      <span className="text-xs font-bold text-[#FF6B9D]">{comboCards.length} Combo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards by tier */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="mb-6"
          >
            <Tabs defaultValue="1">
              <TabsList className="mb-4 w-full">
                {tiers.map(t => {
                  const { label, color } = TIER_CONFIG[t];
                  const count = skill.cards.filter(c => c.tier === t).length;
                  return (
                    <TabsTrigger key={t} value={String(t)} className="flex-1 gap-2">
                      <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                      {label}
                      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tiers.map(t => {
                const cards = skill.cards.filter(c => c.tier === t);
                const { desc } = TIER_CONFIG[t];
                return (
                  <TabsContent key={t} value={String(t)}>
                    <p className="mb-3 text-xs text-muted-foreground">{desc}</p>
                    <div className="flex flex-col gap-2">
                      {cards.map(card => <CardItem key={card.name} card={card} />)}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </motion.div>

          {/* Related Combos */}
          {relatedCombos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
            >
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Synergy Builds Using This Skill
              </h2>
              <div className="flex flex-col gap-2">
                {relatedCombos.map(combo => (
                  <Card
                    key={combo.id}
                    onClick={() => navigate('/combos')}
                    className="cursor-pointer border-border/60 bg-card/80 transition-all duration-150 hover:border-[#B44FFF]/30"
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={cn('h-3 w-3', i < combo.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border')} />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{combo.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{combo.synergy}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Right: sticky Pro Tips sidebar ── */}
        {hasTips && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="sticky top-6"
          >
            <div className="rounded-xl border border-[#FFD700]/20 bg-card/80"
              style={{ background: `linear-gradient(135deg, #FFD70008, hsl(var(--card)) 60%)` }}
            >
              <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                <Lightbulb className="h-4 w-4 text-[#FFD700]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Pro Tips</span>
              </div>
              <div className="flex flex-col divide-y divide-border/40">
                {skill.tips!.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-4">
                    <span className="mt-0.5 text-xs font-bold text-[#FFD700]/60 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
