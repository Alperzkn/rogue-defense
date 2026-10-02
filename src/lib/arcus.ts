// Shared config and persistence for the Arcus referral promotion.
// Both the banner and the modal read from here so copy and links stay in sync.

export const ARCUS = {
  referralUrl: 'https://waitlist.arcus.xyz/s/INTELLIGENXYZ',
  aboutUrl: 'https://arcus.xyz',
  accent: '#00C8FF',
} as const;

const KEYS = {
  bannerDismissed: 'arcus-banner-dismissed',
  modalLastShown: 'arcus-modal-last-shown',
  ctaClicked: 'arcus-cta-clicked',
} as const;

/** Delay before the modal appears, so it never interrupts first paint. */
export const MODAL_DELAY_MS = 6000;
/** How long to wait before showing the modal again after it was closed. */
export const MODAL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode, blocked) — promo simply reappears next visit.
  }
}

export const arcusStore = {
  isBannerDismissed: () => read(KEYS.bannerDismissed) === '1',
  dismissBanner: () => write(KEYS.bannerDismissed, '1'),

  hasClickedCta: () => read(KEYS.ctaClicked) === '1',
  markCtaClicked: () => write(KEYS.ctaClicked, '1'),

  /** True when the modal has not been shown within the cooldown window and the user never clicked through. */
  shouldShowModal: (now = Date.now()) => {
    if (read(KEYS.ctaClicked) === '1') return false;
    const last = Number(read(KEYS.modalLastShown) ?? 0);
    return !Number.isFinite(last) || now - last > MODAL_COOLDOWN_MS;
  },
  markModalShown: (now = Date.now()) => write(KEYS.modalLastShown, String(now)),
};
