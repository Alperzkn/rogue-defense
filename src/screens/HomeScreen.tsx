import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sword, Cpu, Link2, Sparkles, Star, Zap, Link, Heart, Layers, Gem } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { SkillTypeBadge } from '../components';
import { SKILLS, COMBOS, CHIP_SOCKETS } from '../data';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
});

const QUICK_NAV = [
  { path: '/skills', label: 'Skills', icon: Sword, desc: `${SKILLS.length} weapons with upgrade cards`, color: '#FF4500' },
  { path: '/chips', label: 'Chip Sockets', icon: Cpu, desc: `${CHIP_SOCKETS.length} socket types & drop rates`, color: '#00C8FF' },
  { path: '/combos', label: 'Combos', icon: Link2, desc: `${COMBOS.length} curated synergy builds`, color: '#B44FFF' },
  { path: '/status', label: 'Status Effects', icon: Sparkles, desc: '7 debuffs & their interactions', color: '#00FF88' },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const topBuilds = COMBOS.filter(c => c.rating === 5);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">

        {/* Hero */}
        <motion.div {...fadeUp(0)} className="mb-8 overflow-hidden rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm"
          style={{ background: 'linear-gradient(135deg, #7B2FBE18, #00C8FF0D, transparent)' }}>
          <div className="flex items-center gap-6 p-8">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #7B2FBE, #00C8FF)', boxShadow: '0 0 40px #00C8FF40' }}
            >
              <Zap className="h-10 w-10 text-white" />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl font-black tracking-widest text-foreground">ROGUE</h1>
                <h1 className="text-4xl font-black tracking-widest" style={{ color: '#00C8FF', textShadow: '0 0 20px #00C8FF80' }}>
                  DEFENSE
                </h1>
              </div>
              <p className="mt-1 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                Hybrid Tower TD Encyclopedia
              </p>
              <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
                Complete reference for skills, upgrade cards, chip sockets, and combo synergies.
                Find the best builds for every playstyle.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.06)} className="mb-8 grid grid-cols-4 gap-3">
          {[
            { value: SKILLS.length, label: 'Skills', color: '#FF4500' },
            { value: SKILLS.reduce((a, s) => a + s.cards.length, 0), label: 'Upgrade Cards', color: '#00C8FF' },
            { value: CHIP_SOCKETS.length, label: 'Chip Sockets', color: '#FFD700' },
            { value: COMBOS.length, label: 'Synergy Builds', color: '#B44FFF' },
          ].map(({ value, label, color }) => (
            <Card key={label} className="border-border/60 bg-card/80 text-center backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-black" style={{ color, textShadow: `0 0 12px ${color}60` }}>
                  {value}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Navigation */}
        <motion.div {...fadeUp(0.1)} className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Browse
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_NAV.map(({ path, label, icon: Icon, desc, color }) => (
              <Card
                key={path}
                onClick={() => navigate(path)}
                className="group cursor-pointer border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Top Builds */}
        <motion.div {...fadeUp(0.14)} className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Top Builds (5★)
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/combos')} className="h-7 gap-1 text-xs">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {topBuilds.map((combo, i) => (
              <motion.div key={combo.id} {...fadeUp(0.16 + i * 0.04)}>
                <Card
                  onClick={() => navigate('/combos')}
                  className="group cursor-pointer border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-200 hover:border-[#B44FFF]/30 hover:shadow-[0_0_16px_#B44FFF15]"
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-[#FFD700] text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 3px #FFD70080)' }} />
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">{combo.name}</span>
                      <Badge variant="mythic" className="ml-auto">TOP BUILD</Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{combo.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {combo.skills.map(sid => {
                        const skill = SKILLS.find(s => s.id === sid);
                        return skill ? (
                          <div key={sid} className="flex items-center gap-1.5 rounded border border-border bg-secondary px-2 py-0.5">
                            <span className="text-sm">{skill.icon}</span>
                            <span className="text-xs font-medium text-foreground">{skill.name}</span>
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

        {/* Game Mechanics Tips */}
        <motion.div {...fadeUp(0.22)}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Key Mechanics
          </h2>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {[
                { Icon: Link, color: '#00C8FF', title: 'Chain Cards', desc: 'Self-contained upgrades that enhance the skill\'s own mechanics and create internal synergies.' },
                { Icon: Heart, color: '#FF6B9D', title: 'Combo Cards', desc: 'Cross-skill synergies that only activate when you have a specific second skill equipped.' },
                { Icon: Layers, color: '#B44FFF', title: 'Debuff Stacking', desc: 'Stack Slow + Paralyze + Vulnerable for Beam\'s Energy Boost (+60% DMG each, max 300%).' },
                { Icon: Gem, color: '#FFD700', title: 'Ultra Rare Chips', desc: '0.05% drop rate chips that can completely transform your build. Farm them aggressively.' },
              ].map((tip, i, arr) => (
                <div key={tip.title}>
                  <div className="flex gap-4 p-4">
                    <tip.Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tip.color }} />
                    <div>
                      <div className="mb-0.5 text-sm font-semibold text-foreground">{tip.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

    </div>
  );
}
