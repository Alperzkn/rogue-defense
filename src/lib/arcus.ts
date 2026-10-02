// Shared config and persistence for the Arcus referral promotion.
// Both the banner and the modal read from here so copy and links stay in sync.

export const ARCUS = {
  referralUrl: 'https://waitlist.arcus.xyz/s/INTELLIGENXYZ',
  aboutUrl: 'https://arcus.xyz',
  accent: '#00C8FF',
} as const;

const KEYS = {
  bannerDismissed: 'arcus-banner-dismissed',
  modalShown: 'arcus-modal-shown',
  ctaClicked: 'arcus-cta-clicked',
} as const;

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

// Session-scoped flags: reset whenever the user opens the site in a new tab/visit.
function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export const arcusStore = {
  isBannerDismissed: () => read(KEYS.bannerDismissed) === '1',
  dismissBanner: () => write(KEYS.bannerDismissed, '1'),

  hasClickedCta: () => read(KEYS.ctaClicked) === '1',
  markCtaClicked: () => write(KEYS.ctaClicked, '1'),

  /**
   * The modal opens on the first render of every new visit (browser session) and is
   * not repeated while the user navigates within the app. It never returns once the
   * user has clicked through to the waitlist.
   */
  shouldShowModal: () => {
    if (read(KEYS.ctaClicked) === '1') return false;
    return readSession(KEYS.modalShown) !== '1';
  },
  markModalShown: () => writeSession(KEYS.modalShown, '1'),
};
