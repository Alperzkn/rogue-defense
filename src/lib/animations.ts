// Shared animation configurations for consistent motion across the app

export const TIMING = {
  fast: 0.18,
  normal: 0.3,
  slow: 0.45,
  expand: 0.22,
  stagger: 0.04,
} as const;

export const EASE = {
  spring: [0.16, 1, 0.3, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  bounce: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: TIMING.normal, delay, ease: EASE.spring },
});

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: TIMING.normal, delay },
});

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: TIMING.normal, delay, ease: EASE.spring },
});

export const slideRight = (delay = 0) => ({
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: TIMING.normal, delay, ease: EASE.spring },
});

export const staggerContainer = {
  animate: { transition: { staggerChildren: TIMING.stagger } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: TIMING.normal, ease: EASE.spring } },
};
