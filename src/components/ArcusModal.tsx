import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { ARCUS, arcusStore } from '../lib/arcus';
import { TIMING, EASE } from '../lib/animations';
import { ArcusMark } from './ArcusMark';

const { brand } = ARCUS;
const HAIRLINE = 'rgba(247,241,225,0.12)';

const FACTS = [
  ['24/7', 'Tokenized stocks, perpetuals and crypto, with no market close.'],
  ['Self-custodial', 'Built by the dYdX team on Robinhood Chain. You keep your keys.'],
  ['95+ markets', 'Zero spot fees on stock tokens. Perpetuals beta is waitlisted.'],
] as const;

/**
 * Promotional dialog for Arcus, shown on arrival.
 *
 * Styled in Arcus's own palette (forest green, cream, serif wordmark) rather than
 * the encyclopedia's black-and-cyan, and framed explicitly as a third-party
 * sponsored message, so nobody mistakes it for part of the app.
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
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm p-0 sm:items-center sm:p-6"
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
            className="relative w-full max-w-md overflow-hidden rounded-t-2xl sm:rounded-2xl"
            style={{
              backgroundColor: brand.green,
              color: brand.cream,
              boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
              fontFamily: 'Inter, Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {/* Third-party strip: the one thing that must read before anything else */}
            <div
              className="flex items-center justify-between gap-3 px-5 py-2.5 sm:px-7"
              style={{ backgroundColor: brand.greenDeep, color: brand.creamSoft }}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] opacity-90">
                Sponsored message · From a third party, not Rogue Defense
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="-mr-1.5 shrink-0 rounded-full p-1.5 opacity-80 transition-opacity hover:opacity-100"
                style={{ color: brand.cream }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 sm:pt-7 sm:pb-7">
              {/* Wordmark */}
              <div className="flex items-center gap-2.5">
                <ArcusMark />
                <span className="text-[30px] leading-none tracking-[-0.01em]" style={{ fontFamily: brand.serif, color: brand.cream }}>
                  arcus
                </span>
              </div>

              <h2 id={titleId} className="mt-5 text-[26px] leading-[1.1] sm:text-[30px]" style={{ fontFamily: brand.serif, color: brand.cream }}>
                Trade while the world sleeps.
              </h2>

              <p id={descId} className="mt-3 text-[13px] leading-relaxed" style={{ color: brand.creamSoft }}>
                Arcus is a self-custodial exchange for tokenized stocks, perpetuals and crypto, open
                around the clock. I use it and share my referral here; signing up through the button
                applies it automatically.
              </p>

              <dl className="mt-5 border-t" style={{ borderColor: HAIRLINE }}>
                {FACTS.map(([term, text]) => (
                  <div key={term} className="flex items-baseline gap-4 border-b py-2.5" style={{ borderColor: HAIRLINE }}>
                    <dt className="w-[108px] shrink-0 text-[15px] leading-tight" style={{ fontFamily: brand.serif, color: brand.cream }}>
                      {term}
                    </dt>
                    <dd className="text-[12px] leading-relaxed" style={{ color: brand.creamSoft }}>
                      {text}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <a
                  ref={ctaRef}
                  href={ARCUS.referralUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={onCta}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-semibold transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a2ee3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e3b25] sm:flex-1"
                  style={{ backgroundColor: brand.cream, color: brand.greenDeep }}
                >
                  Join the Arcus waitlist
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center rounded-full border px-5 py-3.5 text-[13px] font-medium transition-colors sm:w-auto sm:py-3"
                  style={{ borderColor: 'rgba(247,241,225,0.25)', color: brand.creamSoft }}
                >
                  Not now
                </button>
              </div>

              <p className="mt-4 text-[10px] leading-relaxed" style={{ color: 'rgba(232,221,190,0.6)' }}>
                Arcus is an independent service with no connection to this encyclopedia or the game.
                Trading involves risk and this is not financial advice. Availability depends on your
                jurisdiction.{' '}
                <a href={ARCUS.aboutUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: brand.creamSoft }}>
                  arcus.xyz
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
