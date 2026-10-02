import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { ARCUS, arcusStore } from '../lib/arcus';
import { ArcusMark } from './ArcusMark';

const { brand } = ARCUS;

/**
 * Minimal one-row referral strip for Arcus, in the Arcus palette so it reads as
 * a third-party message rather than part of the encyclopedia. The full
 * explanation and risk note live in ArcusModal; this is only a reminder.
 */
export function ArcusBanner() {
  const [dismissed, setDismissed] = useState<boolean>(arcusStore.isBannerDismissed);

  if (dismissed) return null;

  const dismiss = () => {
    arcusStore.dismissBanner();
    setDismissed(true);
  };

  return (
    <aside
      aria-label="Arcus sponsored message"
      style={{
        backgroundColor: brand.green,
        color: brand.cream,
        fontFamily: 'Inter, Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-2 sm:gap-5 sm:px-6">
        {/* Wordmark + label */}
        <div className="flex min-w-0 items-center gap-2">
          <ArcusMark size={18} />
          <div className="min-w-0 leading-none">
            <span className="block text-[19px] leading-none" style={{ fontFamily: brand.serif }}>
              arcus
            </span>
            <span className="mt-0.5 block whitespace-nowrap text-[8px] uppercase tracking-[0.18em]" style={{ color: 'rgba(232,221,190,0.6)' }}>
              Sponsored · Not affiliated
            </span>
          </div>
        </div>

        {/* Tagline, wider screens only */}
        <p className="hidden min-w-0 flex-1 truncate text-[12px] sm:block" style={{ color: brand.creamSoft }}>
          <span style={{ fontFamily: brand.serif, color: brand.cream }}>Trade while the world sleeps.</span>{' '}
          Tokenized stocks, perpetuals and crypto, 24/7. Referral applied via this link.
        </p>

        {/* CTA + close */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={ARCUS.referralUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={arcusStore.markCtaClicked}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a2ee3a]"
            style={{ backgroundColor: brand.cream, color: brand.greenDeep }}
          >
            Join waitlist
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            aria-label="Dismiss Arcus message"
            onClick={dismiss}
            className="rounded-full p-1.5 opacity-70 transition-opacity hover:opacity-100"
            style={{ color: brand.cream }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
