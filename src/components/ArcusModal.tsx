import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X, Clock, ShieldCheck, LineChart } from 'lucide-react';
import { ARCUS, arcusStore } from '../lib/arcus';
import { TIMING, EASE } from '../lib/animations';

const FACTS = [
  { Icon: Clock, text: 'Markets open 24/7 — tokenized stocks, perpetuals and crypto in one place.' },
  { Icon: ShieldCheck, text: 'Self-custodial exchange on Robinhood Chain, built by the dYdX team.' },
  { Icon: LineChart, text: '95+ markets and zero spot fees on stock tokens. Perpetuals beta is waitlisted.' },
];

/**
 * Promotional dialog for Arcus, shown on arrival.
 *
 * Behaviour:
 * - part of the very first render, so it is the first thing a visitor sees
 * - once per browser session, and never again after a click-through
 * - bottom sheet on phones, centred card on desktop
 * - closes on Escape, backdrop click, "Not now", or the X; focus moves into the dialog
 */
export function ArcusModal() {
  // Decide synchronously so the dialog is present in the first paint, not a frame later.
  const [open, setOpen] = useState<boolean>(() => arcusStore.shouldShowModal());
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Record that this visit has seen the modal, so in-app navigation does not re-open it.
  useEffect(() => {
    if (open) arcusStore.markModalShown();
  }, []);

  // Keyboard handling and initial focus while open.
  useEffect(() => {
    if (!open) return;
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const onCta = () => {
    arcusStore.markCtaClicked();
    setOpen(false);
  };

  const sheet = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="arcus-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TIMING.fast }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/65 backdrop-blur-sm p-0 sm:items-center sm:p-6"
          onClick={close}
        >
          <motion.div
            {...sheet}
            transition={{ duration: TIMING.normal, ease: EASE.spring }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md border-t border-border/60 bg-card shadow-2xl sm:border"
            style={{ boxShadow: `0 0 0 1px ${ARCUS.accent}26, 0 24px 80px rgba(0,0,0,0.6)` }}
          >
            {/* Accent rule */}
            <div className="h-[3px] w-full" style={{ backgroundColor: ARCUS.accent }} />

            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-3 top-5 rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 sm:pt-6 sm:pb-7">
              <p className="pr-10 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: ARCUS.accent }}>
                Referral · Not affiliated with Rogue Defense
              </p>

              <h2 id={titleId} className="font-display mt-3 text-[22px] leading-[1.05] font-black tracking-[-0.03em] text-foreground sm:text-[26px]">
                Arcus<span className="text-foreground/30">.</span> Markets that don't close.
              </h2>

              <p id={descId} className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                A self-custodial exchange for trading tokenized stocks, perpetuals and crypto around the clock.
                Signing up through the button below applies my referral code automatically.
              </p>

              <ul className="mt-4 space-y-2.5">
                {FACTS.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border"
                      style={{ borderColor: `${ARCUS.accent}40`, backgroundColor: `${ARCUS.accent}12` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: ARCUS.accent }} strokeWidth={1.75} />
                    </span>
                    <span className="text-[12px] leading-relaxed text-foreground/85">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <a
                  ref={ctaRef}
                  href={ARCUS.referralUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={onCta}
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-background transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
                  style={{ backgroundColor: ARCUS.accent, boxShadow: `0 0 24px ${ARCUS.accent}55` }}
                >
                  Join the waitlist
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground sm:w-auto sm:py-3"
                >
                  Not now
                </button>
              </div>

              <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground/60">
                Trading involves risk and this is not financial advice. Availability depends on your jurisdiction.{' '}
                <a
                  href={ARCUS.aboutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-2 hover:text-foreground"
                >
                  About Arcus
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
