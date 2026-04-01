import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sword, Cpu, Link2, Sparkles, Star, Link, Heart, Layers, Gem, Wrench, Skull } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { SkillTypeBadge, SkillIcon } from '../components';
import { SKILLS, COMBOS, CHIP_SOCKETS, ENEMIES } from '../data';
import { fadeUp, staggerItem, TIMING, EASE } from '../lib/animations';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const QUICK_NAV = [
  { path: '/skills', label: 'Skills', icon: Sword, desc: `${SKILLS.length} weapons with upgrade cards`, color: '#FF4500' },
  { path: '/chips', label: 'Chip Sockets', icon: Cpu, desc: `${CHIP_SOCKETS.length} socket types & drop rates`, color: '#00C8FF' },
  { path: '/combos', label: 'Combos', icon: Link2, desc: `${COMBOS.length} curated synergy builds`, color: '#B44FFF' },
  { path: '/status', label: 'Status Effects', icon: Sparkles, desc: '7 debuffs & their interactions', color: '#00FF88' },
  { path: '/enemies', label: 'Enemies', icon: Skull, desc: `${ENEMIES.length} enemies with resistances & tips`, color: '#EF4444' },
  { path: '/build', label: 'Build Planner', icon: Wrench, desc: 'Plan your build with chip recommendations', color: '#FFD700' },
];

const STATS = [
  { value: SKILLS.length, label: 'Skills', color: '#FF4500' },
  { value: SKILLS.reduce((a, s) => a + s.cards.length, 0), label: 'Upgrade Cards', color: '#00C8FF' },
  { value: CHIP_SOCKETS.length, label: 'Chip Sockets', color: '#FFD700' },
  { value: COMBOS.length, label: 'Synergy Builds', color: '#B44FFF' },
  { value: ENEMIES.length, label: 'Enemies', color: '#EF4444' },
];

export function HomeScreen() {
  useDocumentTitle();
  const navigate = useNavigate();
  const topBuilds = COMBOS.filter(c => c.rating === 5);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">

      {/* Hero */}
      <motion.div {...fadeUp(0)} className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Rogue <span className="text-primary">Defense</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
          Complete reference for skills, upgrade cards, chip sockets, and combo synergies.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.05)} className="mb-10 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
        {STATS.map(({ value, label, color }) => (
          <div key={label} className="rounded-xl border border-border/40 bg-card/60 p-4 text-center">
            <div className="text-2xl font-black tabular-nums" style={{ color }}>{value}</div>
            <div className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Quick Navigation */}
      <motion.div {...fadeUp(0.1)} className="mb-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Browse</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_NAV.map(({ path, label, icon: Icon, desc, color }) => (
            <motion.div
              key={path}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={EASE.bounce}
            >
              <Card
                onClick={() => navigate(path)}
                className="group cursor-pointer border-border/40 bg-card/60 transition-all duration-200 hover:border-border/80"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground">{label}</div>
                    <div className="text-[11px] text-muted-foreground">{desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Builds */}
      <motion.div {...fadeUp(0.15)} className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Top Builds</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/combos')} className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-3">
          {topBuilds.map((combo, i) => (
            <motion.div key={combo.id} {...fadeUp(0.17 + i * TIMING.stagger)}>
              <Card
                onClick={() => navigate('/combos')}
                className="group cursor-pointer border-border/40 bg-card/60 transition-all duration-200 hover:border-border/80"
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star key={j} className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{combo.name}</span>
                    <Badge variant="mythic" className="ml-auto text-[9px]">TOP BUILD</Badge>
                  </div>
                  <p className="mb-3 text-[13px] text-muted-foreground leading-relaxed">{combo.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {combo.skills.map(sid => {
                      const skill = SKILLS.find(s => s.id === sid);
                      return skill ? (
                        <div key={sid} className="flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary/50 px-2 py-1">
                          <SkillIcon skill={skill} size={14} />
                          <span className="text-[11px] font-medium text-foreground">{skill.name}</span>
                          <SkillTypeBadge type={skill.type} />
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Mechanics */}
      <motion.div {...fadeUp(0.22)}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Key Mechanics</h2>
        <Card className="border-border/40 bg-card/60 overflow-hidden">
          <CardContent className="p-0">
            {[
              { Icon: Link, color: '#00C8FF', title: 'Chain Cards', desc: 'Self-contained upgrades that enhance the skill\'s own mechanics and create internal synergies.' },
              { Icon: Heart, color: '#FF6B9D', title: 'Combo Cards', desc: 'Cross-skill synergies that only activate when you have a specific second skill equipped.' },
              { Icon: Layers, color: '#B44FFF', title: 'Debuff Stacking', desc: 'Stack Slow + Paralyze + Vulnerable for Beam\'s Energy Boost (+60% DMG each, max 300%).' },
              { Icon: Gem, color: '#FFD700', title: 'Ultra Rare Chips', desc: '0.05% drop rate chips that can completely transform your build. Farm them aggressively.' },
            ].map((tip, i, arr) => (
              <div key={tip.title}>
                <div className="flex gap-4 px-5 py-4">
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${tip.color}12` }}
                  >
                    <tip.Icon className="h-3.5 w-3.5" style={{ color: tip.color }} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">{tip.title}</div>
                    <div className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">{tip.desc}</div>
                  </div>
                </div>
                {i < arr.length - 1 && <Separator className="opacity-50" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
