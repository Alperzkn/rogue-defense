import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Link, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { SkillTypeBadge, SkillIcon } from '../components';
import { SKILLS } from '../data';
import type { SkillType } from '../data/types';
import { SkillTypeColors } from '../theme/colors';
import { fadeUp, TIMING, EASE } from '../lib/animations';

const TYPE_FILTERS: { label: string; value: SkillType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Fire', value: 'fire' },
  { label: 'Electric', value: 'electric' },
  { label: 'Energy', value: 'energy' },
  { label: 'Physical', value: 'physical' },
  { label: 'Field', value: 'field' },
];

export function SkillsScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<SkillType | 'all'>('all');

  const filtered = useMemo(() =>
    SKILLS.filter(s => {
      const matchType = activeFilter === 'all' || s.type === activeFilter;
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    }), [search, activeFilter]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {SKILLS.length} weapons &middot; {SKILLS.reduce((a, s) => a + s.cards.length, 0)} upgrade cards
        </p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div {...fadeUp(0.04)} className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="pl-9 pr-9"
          />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map(f => {
            const active = activeFilter === f.value;
            const color = f.value === 'all' ? '#00C8FF' : SkillTypeColors[f.value as SkillType];
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-200',
                  active
                    ? 'text-foreground'
                    : 'border-border/50 text-muted-foreground hover:text-foreground'
                )}
                style={active ? { borderColor: `${color}60`, backgroundColor: `${color}12`, color } : {}}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Results */}
      {search && (
        <p className="mb-3 text-[11px] text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((skill, i) => {
            const typeColor = SkillTypeColors[skill.type];
            const chainCount = skill.cards.filter(c => c.tag === 'Chain').length;
            const comboCount = skill.cards.filter(c => c.tag === 'Combo').length;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: TIMING.normal, delay: i * TIMING.stagger, ease: EASE.spring }}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={EASE.bounce}
                >
                  <Card
                    onClick={() => navigate(`/skills/${skill.id}`)}
                    className="group cursor-pointer overflow-hidden transition-all duration-200 hover:brightness-110"
                    style={{
                      border: `1px solid ${typeColor}25`,
                      background: `linear-gradient(135deg, ${typeColor}18, ${typeColor}08 50%, hsl(var(--card)) 100%)`,
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center text-2xl overflow-hidden ${skill.iconImage ? 'rounded-full' : 'rounded-lg'}`}
                          style={{ backgroundColor: `${typeColor}10`, border: `1px solid ${typeColor}20` }}
                        >
                          <SkillIcon skill={skill} size={skill.iconImage ? 48 : 24} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">{skill.name}</span>
                            <SkillTypeBadge type={skill.type} />
                          </div>
                          <p className="mb-3 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {skill.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {chainCount > 0 && (
                              <div className="flex items-center gap-1 rounded-md border border-[#00C8FF]/20 bg-[#00C8FF]/5 px-2 py-0.5">
                                <Link className="h-2.5 w-2.5 text-[#00C8FF]" />
                                <span className="text-[10px] font-semibold text-[#00C8FF]">{chainCount} Chain</span>
                              </div>
                            )}
                            {comboCount > 0 && (
                              <div className="flex items-center gap-1 rounded-md border border-[#FF6B9D]/20 bg-[#FF6B9D]/5 px-2 py-0.5">
                                <Heart className="h-2.5 w-2.5 text-[#FF6B9D]" />
                                <span className="text-[10px] font-semibold text-[#FF6B9D]">{comboCount} Combo</span>
                              </div>
                            )}
                            <span className="ml-auto text-[10px] text-muted-foreground">
                              {skill.cards.length} cards
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div {...fadeUp(0)} className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <Search className="h-8 w-8 opacity-20" />
          <p className="text-sm">No skills match your search</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setActiveFilter('all'); }}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary hover:text-foreground"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
