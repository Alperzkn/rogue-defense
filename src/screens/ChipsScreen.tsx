import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { RarityBadge, rarityInfo } from '../components/RarityBadge';
import { CHIP_SOCKETS } from '../data';
import type { ChipSocketData, ChipStat } from '../data/types';
import { useDocumentTitle } from '../lib/useDocumentTitle';

function StatRow({ stat, index }: { stat: ChipStat; index: number }) {
  const { variant } = rarityInfo(stat.chance);
  const isUltra = stat.chance <= 0.05;
  const isVeryRare = stat.chance <= 0.10 && stat.chance > 0.05;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors',
        isUltra && 'border border-[#FFD700]/20 bg-[#FFD700]/5',
        isVeryRare && 'bg-[#A855F7]/5',
        !isUltra && !isVeryRare && 'hover:bg-secondary/50',
      )}
    >
      {isUltra && <Star className="h-3 w-3 shrink-0 fill-[#FFD700] text-[#FFD700]" />}
      <p className={cn(
        'flex-1 text-sm leading-snug',
        isUltra ? 'font-medium text-[#FFD700]' : isVeryRare ? 'text-[#A855F7]' : 'text-muted-foreground',
      )}>
        {stat.description}
      </p>
      <RarityBadge chance={stat.chance} />
    </motion.div>
  );
}

function SocketCard({ socket, defaultOpen = false }: { socket: ChipSocketData; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const sorted = [...socket.stats].sort((a, b) => a.chance - b.chance);
  const ultraCount = socket.stats.filter(s => s.chance <= 0.05).length;
  const rareCount = socket.stats.filter(s => s.chance <= 0.25 && s.chance > 0.10).length;

  return (
    <Card className="overflow-hidden border-border/60 bg-card/80">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full text-left"
        aria-expanded={open ? 'true' : 'false'}
        aria-label={`Toggle ${socket.name} chip stats`}
      >
        <CardContent className="flex items-center gap-4 p-4">
          {/* Socket icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl"
            style={{ backgroundColor: `${socket.color}18`, border: `1px solid ${socket.color}35` }}
          >
            {socket.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground" style={{ color: socket.color }}>{socket.name}</span>
              {ultraCount > 0 && (
                <Badge variant="mythic" className="gap-1">
                  <Star className="h-2.5 w-2.5 fill-[#FFD700]" /> {ultraCount} Ultra
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{socket.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="common">{socket.stats.length} stats</Badge>
              {ultraCount > 0 && <Badge variant="mythic">{ultraCount} Ultra Rare</Badge>}
              {rareCount > 0 && <Badge variant="rare">{rareCount} Rare</Badge>}
            </div>
          </div>

          <ChevronDown className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )} />
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
            <CardContent className="pb-2 pt-3">
              <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>Sorted by rarity — rarest first</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="flex items-center gap-1 text-[#FFD700]">
                  <Star className="h-2.5 w-2.5 fill-[#FFD700]" /> = Ultra Rare (0.05%)
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {sorted.map((stat, i) => <StatRow key={i} stat={stat} index={i} />)}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function ChipsScreen() {
  useDocumentTitle('Chip Sockets');
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Chip Sockets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mythic-grade chips with drop rates. Expand each socket to see all available stats.
        </p>
      </div>

      {/* Rarity Legend */}
      <Card className="mb-6 border-border/60 bg-card/80">
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground self-center mr-2">
            Rarity
          </span>
          {[
            { label: 'Ultra Rare', variant: 'mythic' as const, rate: '0.05%', note: 'Game-changing effects' },
            { label: 'Very Rare', variant: 'epic' as const, rate: '0.10%', note: '' },
            { label: 'Rare', variant: 'rare' as const, rate: '0.25%', note: '' },
            { label: 'Common', variant: 'common' as const, rate: '0.51%', note: '' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-2">
              <Badge variant={r.variant}>{r.label}</Badge>
              <span className="text-xs text-muted-foreground">{r.rate}</span>
              {r.note && <span className="text-xs text-muted-foreground opacity-60">— {r.note}</span>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Socket cards */}
      <div className="flex flex-col gap-3">
        {CHIP_SOCKETS.map((socket, i) => (
          <motion.div
            key={socket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <SocketCard socket={socket} defaultOpen={i === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
