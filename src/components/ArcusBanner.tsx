import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

const REFERRAL_URL = 'https://waitlist.arcus.xyz/s/INTELLIGENXYZ';
const ABOUT_URL = 'https://arcus.xyz';
const STORAGE_KEY = 'arcus-banner-dismissed';
const ACCENT = '#00C8FF';

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Storage unavailable (private mode, blocked) — banner simply reappears next visit.
  }
}

/**
 * Referral strip for Arcus. Kept deliberately plain and factual:
 * no hype, a clear "referral" label, and a short risk / availability note.
 */
export function ArcusBanner() {
  const [dismissed, setDismissed] = useState<boolean>(readDismissed);

  if (dismissed) return null;

  const dismiss = () => {
    writeDismissed();
    setDismissed(true);
  };

  return (
    <aside
      aria-label="Arcus referral"
      className="relative border-b border-border/50 bg-card/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-3 pr-12 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:pr-14">
        {/* Copy */}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            Referral · Not affiliated with Rogue Defense
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Arcus</span> is a self-custodial exchange on Robinhood
            Chain, built by the dYdX team, for trading tokenized stocks, perpetuals and crypto around the clock.
            Perpetuals access is currently waitlisted. Signing up through the button applies my referral code
            automatically.{' '}
            <a
              href={ABOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              About Arcus
            </a>
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground/60">
            Trading involves risk and this is not financial advice. Availability depends on your jurisdiction.
          </p>
        </div>

        {/* CTA — full-width tap target on phones, compact on desktop */}
        <a
          href={REFERRAL_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 border px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors sm:w-auto sm:py-2.5"
          style={{ borderColor: `${ACCENT}66`, backgroundColor: `${ACCENT}1a`, color: ACCENT }}
        >
          Join the waitlist
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <button
        type="button"
        aria-label="Dismiss Arcus referral"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground sm:right-4 sm:top-1/2 sm:-translate-y-1/2"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}
