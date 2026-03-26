import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { STATUS_EFFECTS } from '../data';
import type { StatusEffect } from '../data/types';

function StatusCard({ effect, index }: { effect: StatusEffect; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="overflow-hidden border-border/60 bg-card/80">
        {/* Colored top accent bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: effect.color }} />

        <CardContent className="p-5">
          {/* Header */}
          <div className="mb-4 flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{
                backgroundColor: `${effect.color}15`,
                border: `1px solid ${effect.color}40`,
                boxShadow: `0 0 12px ${effect.color}20`,
              }}
            >
              {effect.icon}
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: effect.color }}>
                {effect.name}
              </h3>
              <div className="mt-1 h-0.5 w-8 rounded-full" style={{ backgroundColor: effect.color }} />
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            {effect.description}
          </p>

          <Separator className="mb-4" />

          {/* Sources */}
          <div>
            <p
              className="mb-2 text-[10px] font-black uppercase tracking-widest"
              style={{ color: effect.color }}
            >
              Sources
            </p>
            <div className="flex flex-col gap-2">
              {effect.sources.map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.07 + i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: effect.color }}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">{source}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatusEffectsScreen() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Status Effects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {STATUS_EFFECTS.length} debuffs & conditions · Stack multiple for exponential damage
        </p>
      </div>

      {/* Overview strip */}
      <Card className="mb-6 border-border/60 bg-card/80">
        <CardContent className="flex flex-wrap items-center justify-center gap-5 p-4">
          {STATUS_EFFECTS.map(e => (
            <div key={e.id} className="flex flex-col items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: e.color, boxShadow: `0 0 6px ${e.color}` }}
              />
              <span className="text-xl">{e.icon}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{e.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {STATUS_EFFECTS.map((effect, i) => (
          <StatusCard key={effect.id} effect={effect} index={i} />
        ))}
      </div>
    </div>
  );
}
