import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Link, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { SkillTypeBadge } from '../components';
import { SKILLS } from '../data';
import type { SkillType } from '../data/types';
import { SkillTypeColors } from '../theme/colors';

const TYPE_FILTERS: { label: string; value: SkillType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Fire', value: 'fire' },
  { label: 'Electric', value: 'electric' },
  { label: 'Energy', value: 'energy' },
  { label: 'Physical', value: 'physical' },
  { label: 'Gravity', value: 'gravity' },
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
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {SKILLS.length} weapons · {SKILLS.reduce((a, s) => a + s.cards.length, 0)} upgrade cards total
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills or descriptions…"
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
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150',
                  active
                    ? 'text-foreground'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                )}
                style={active ? { borderColor: color, backgroundColor: `${color}18`, color } : {}}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="mb-3 text-xs text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
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
                transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  onClick={() => navigate(`/skills/${skill.id}`)}
                  className="group relative cursor-pointer overflow-hidden border-border/60 bg-card/80 transition-all duration-200 hover:border-primary/20 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.08)]"
                >
                  {/* Colored left border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200 group-hover:w-[3px]"
                    style={{ backgroundColor: typeColor }}
                  />
                  {/* Subtle type gradient */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${typeColor}08, transparent 60%)` }}
                  />

                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl"
                        style={{ backgroundColor: `${typeColor}15`, border: `1px solid ${typeColor}30` }}
                      >
                        {skill.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Name + type */}
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">{skill.name}</span>
                          <SkillTypeBadge type={skill.type} />
                        </div>
                        {/* Description */}
                        <p className="mb-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>
                        {/* Stats */}
                        <div className="flex items-center gap-2">
                          {chainCount > 0 && (
                            <div className="flex items-center gap-1 rounded border border-[#00C8FF]/30 bg-[#00C8FF]/8 px-2 py-0.5">
                              <Link className="h-2.5 w-2.5 text-[#00C8FF]" />
                              <span className="text-[10px] font-semibold text-[#00C8FF]">{chainCount} Chain</span>
                            </div>
                          )}
                          {comboCount > 0 && (
                            <div className="flex items-center gap-1 rounded border border-[#FF6B9D]/30 bg-[#FF6B9D]/8 px-2 py-0.5">
                              <Heart className="h-2.5 w-2.5 text-[#FF6B9D]" />
                              <span className="text-[10px] font-semibold text-[#FF6B9D]">{comboCount} Combo</span>
                            </div>
                          )}
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {skill.cards.length} cards
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
          <Search className="h-8 w-8 opacity-30" />
          <p className="text-sm">No skills match &ldquo;{search}&rdquo;</p>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setActiveFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
