import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sword, Cpu, Link2, Sparkles, Star, Link, Heart, Layers, Gem, Wrench, Skull } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { SkillTypeBadge, SkillIcon } from '../components';
import { SKILLS, COMBOS, CHIP_SOCKETS, ENEMIES } from '../data';
import { fadeUp, TIMING, EASE } from '../lib/animations';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const QUICK_NAV = [
  { path: '/skills', label: 'Skills', icon: Sword, desc: `${SKILLS.length} weapons · upgrade cards`, color: '#FF4500', index: '01' },
  { path: '/chips', label: 'Chip Sockets', icon: Cpu, desc: `${CHIP_SOCKETS.length} socket types · drop rates`, color: '#00C8FF', index: '02' },
  { path: '/combos', label: 'Combos', icon: Link2, desc: `${COMBOS.length} curated synergy builds`, color: '#B44FFF', index: '03' },
  { path: '/status', label: 'Status Effects', icon: Sparkles, desc: '7 debuffs · interactions', color: '#00FF88', index: '04' },
  { path: '/enemies', label: 'Enemies', icon: Skull, desc: `${ENEMIES.length} enemies · resistances`, color: '#EF4444', index: '05' },
  { path: '/build', label: 'Build Planner', icon: Wrench, desc: 'Interactive chip planner', color: '#FFD700', index: '06' },
];

const STATS = [
  { value: SKILLS.length, label: 'Skills', color: '#FF4500' },
  { value: SKILLS.reduce((a, s) => a + s.cards.length, 0), label: 'Cards', color: '#00C8FF' },
  { value: CHIP_SOCKETS.length, label: 'Chips', color: '#FFD700' },
  { value: COMBOS.length, label: 'Builds', color: '#B44FFF' },
  { value: ENEMIES.length, label: 'Enemies', color: '#EF4444' },
];

const MECHANICS = [
  { Icon: Link, color: '#00C8FF', title: 'Chain Cards', desc: "Self-contained upgrades that enhance the skill's own mechanics and create internal synergies." },
  { Icon: Heart, color: '#FF6B9D', title: 'Combo Cards', desc: 'Cross-skill synergies that only activate when you have a specific second skill equipped.' },
  { Icon: Layers, color: '#B44FFF', title: 'Debuff Stacking', desc: "Stack Slow + Paralyze + Vulnerable for Beam's Energy Boost (+60% DMG each, max 300%)." },
  { Icon: Gem, color: '#FFD700', title: 'Ultra Rare Chips', desc: '0.05% drop rate chips that can completely transform your build. Farm them aggressively.' },
];

export function HomeScreen() {
  useDocumentTitle();
  const navigate = useNavigate();
  const topBuilds = COMBOS.filter(c => c.rating === 5);

  return (
    <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10 py-8 sm:py-14">

      {/* Editorial gutter ticker (desktop only) */}
      <div className="pointer-events-none hidden lg:flex absolute right-4 top-0 bottom-0 w-6 flex-col items-center justify-start pt-16 gap-8 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 [writing-mode:vertical-rl]">
        <span>RD // Encyclopedia // 2026</span>
        <span>Build · Chip · Combo</span>
      </div>

      {/* Disclaimer — turned into a print-style masthead strip */}
      <motion.div {...fadeUp(0)} className="mb-10 border-l-2 border-primary pl-4 py-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">Community Project · Unofficial</p>
        <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed max-w-xl">
          Built by a fellow player to help the community. Information may not be 100% accurate — use the
          <span className="font-semibold text-foreground/90"> feedback button</span> to report errors.
        </p>
      </motion.div>

      {/* Hero — asymmetric, oversized */}
      <motion.div {...fadeUp(0.04)} className="relative mb-12">
        <div className="flex items-start justify-between gap-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">Issue 01</span> / Hybrid Tower TD
          </div>
          <div className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-right">
            Updated · Apr 2026
          </div>
        </div>

        <h1 className="font-display mt-4 text-[clamp(2.75rem,11vw,7.5rem)] leading-[0.82] font-black tracking-[-0.055em] text-foreground">
          ROGUE
        </h1>
        <div className="relative mt-1 sm:-mt-3">
          <h1 className="font-display text-[clamp(2.75rem,11vw,7.5rem)] leading-[0.82] font-black tracking-[-0.055em] text-primary text-glow-primary pl-[18%]">
            DEFENSE<span className="text-foreground/30">.</span>
          </h1>
          {/* Accent block */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:block h-[70%] w-[14%]">
            <div className="h-full w-full border-l-2 border-primary/60" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">
                The<br />Encyclopedia
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-[15px] text-muted-foreground leading-relaxed">
          Complete reference for skills, upgrade cards, chip sockets, and combo synergies —
          written for players, by a player.
        </p>
      </motion.div>

      {/* Stats — one horizontal strip, no cards, editorial rule */}
      <motion.div {...fadeUp(0.08)} className="mb-16">
        <div className="rule-line mb-6" />
        <div className="flex items-end gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          {STATS.map(({ value, label, color }, i) => (
            <div
              key={label}
              className="relative flex-1 min-w-[100px] border-r border-border/50 last:border-r-0 pr-3 sm:pr-5"
            >
              <div
                className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-none font-black tabular-nums tracking-[-0.06em]"
                style={{ color }}
              >
                {String(value).padStart(2, '0')}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Browse — slab-left index cards, sharper edges */}
      <motion.div {...fadeUp(0.12)} className="mb-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="slash font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Section</p>
            <h2 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground">Browse</h2>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {String(QUICK_NAV.length).padStart(2, '0')} destinations
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border/60 border border-border/60">
          {QUICK_NAV.map(({ path, label, icon: Icon, desc, color, index }, i) => (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.015)' }}
              transition={EASE.bounce}
              className="group relative text-left bg-card/80 hover:bg-card transition-colors"
            >
              {/* Left accent slab — full height, type color */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[5px] transition-all duration-200 group-hover:w-2"
                style={{ backgroundColor: color }}
              />
              <div className="pl-6 pr-5 py-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color }}
                  >
                    {index}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground/40 transition-all duration-200 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <div className="flex items-center gap-3 mb-1.5">
                  <Icon className="h-5 w-5 shrink-0" style={{ color }} strokeWidth={1.75} />
                  <span className="font-display text-lg font-bold tracking-tight text-foreground">
                    {label}
                  </span>
                </div>
                <div className="text-[12px] text-muted-foreground leading-relaxed">{desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Top Builds — editorial spread */}
      <motion.div {...fadeUp(0.18)} className="mb-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="slash font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Featured</p>
            <h2 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground">Top Builds</h2>
          </div>
          <button
            onClick={() => navigate('/combos')}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            All builds <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-[1px] bg-border/60 border border-border/60">
          {topBuilds.map((combo, i) => (
            <motion.button
              key={combo.id}
              {...fadeUp(0.2 + i * TIMING.stagger)}
              onClick={() => navigate('/combos')}
              className="group w-full text-left bg-card/80 hover:bg-card transition-colors p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Large issue-number style rating */}
                <div className="flex sm:flex-col sm:items-start items-center gap-2 sm:gap-0 sm:min-w-[80px]">
                  <div className="font-display text-3xl sm:text-4xl font-black tracking-[-0.05em] text-[#FFD700]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700]" />
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                      {combo.name}
                    </h3>
                    <Badge variant="mythic" className="text-[9px] font-mono">TOP</Badge>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{combo.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {combo.skills.map(sid => {
                      const skill = SKILLS.find(s => s.id === sid);
                      return skill ? (
                        <div key={sid} className="flex items-center gap-1.5 border border-border/60 bg-secondary/40 px-2 py-1">
                          <SkillIcon skill={skill} size={14} />
                          <span className="text-[11px] font-medium text-foreground">{skill.name}</span>
                          <SkillTypeBadge type={skill.type} />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <ArrowUpRight className="hidden sm:block h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Key Mechanics — numbered chapter layout */}
      <motion.div {...fadeUp(0.24)} className="mb-8">
        <div className="mb-5">
          <p className="slash font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Primer</p>
          <h2 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground">Key Mechanics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-border/60 border border-border/60">
          {MECHANICS.map((tip, i) => (
            <div key={tip.title} className="bg-card/80 p-5 sm:p-6 relative">
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="font-display text-3xl font-black tracking-[-0.05em] tabular-nums"
                  style={{ color: tip.color }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <tip.Icon className="h-4 w-4" style={{ color: tip.color }} strokeWidth={1.75} />
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {`Ch.${i + 1}`}
                </div>
              </div>
              <h3 className="font-display text-base font-bold tracking-tight text-foreground mb-1.5">
                {tip.title}
              </h3>
              <p className="text-[12.5px] text-muted-foreground leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Colophon */}
      <motion.div {...fadeUp(0.3)} className="pt-8 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          End · Issue 01
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Feedback welcome · Never official
        </div>
      </motion.div>

    </div>
  );
}
