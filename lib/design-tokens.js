/**
 * Design Tokens - UI Design System
 * Centralized design values for consistency
 * Based on 8pt grid system
 */

export const colors = {
  // Primary palette
  primary: {
    50: '#E6F0F3',
    100: '#C0DBE1',
    200: '#96C4CE',
    300: '#6CADBA',
    400: '#4D9CAC',
    500: '#2E6A80', // Main
    600: '#1B4D5C', // Dark
    700: '#0F3540', // Darker
    800: '#0A242C',
    900: '#051318',
  },
  // Accent palette
  accent: {
    50: '#FEF3EB',
    100: '#FCE0CC',
    200: '#F9C8A8',
    300: '#F6B084',
    400: '#F29559',
    500: '#E67635', // Main
    600: '#C45A1A', // Dark
    700: '#9A4715',
    800: '#703410',
    900: '#46210A',
  },
  // Neutral palette
  neutral: {
    0: '#FFFFFF',
    50: '#FAFBFC',
    100: '#F0F3F5',
    200: '#E2E8EC',
    300: '#C9D3D9',
    400: '#8A9BA3',
    500: '#5A6B73',
    600: '#3D4A52',
    700: '#2B363C',
    800: '#1A2B32',
    900: '#0D1518',
  },
  // Semantic colors
  success: {
    light: '#DCFCE7',
    main: '#059669',
    dark: '#047857',
  },
  error: {
    light: '#FEE2E2',
    main: '#DC2626',
    dark: '#B91C1C',
  },
  warning: {
    light: '#FEF3C7',
    main: '#D97706',
    dark: '#B45309',
  },
  info: {
    light: '#DBEAFE',
    main: '#2563EB',
    dark: '#1D4ED8',
  },
};

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

export const typography = {
  fontFamily: {
    display: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    body: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.7,
    loose: 2,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const borderRadius = {
  none: '0',
  sm: '6px',
  md: '12px',
  lg: '20px',
  xl: '28px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(27, 77, 92, 0.04)',
  md: '0 4px 12px rgba(27, 77, 92, 0.08)',
  lg: '0 8px 30px rgba(27, 77, 92, 0.12)',
  xl: '0 20px 50px rgba(27, 77, 92, 0.15)',
  glow: '0 0 20px rgba(230, 118, 53, 0.3)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.22, 1, 0.36, 1)',
  normal: '300ms cubic-bezier(0.22, 1, 0.36, 1)',
  slow: '500ms cubic-bezier(0.22, 1, 0.36, 1)',
  spring: 'type: spring, stiffness: 100, damping: 20',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

// CSS Variables export for inline styles
export const cssVars = {
  '--color-primary': colors.primary[500],
  '--color-primary-light': colors.primary[400],
  '--color-primary-dark': colors.primary[600],
  '--color-accent': colors.accent[500],
  '--color-accent-light': colors.accent[400],
  '--color-accent-dark': colors.accent[600],
  '--color-surface': colors.neutral[0],
  '--color-surface-elevated': colors.neutral[50],
  '--color-text': colors.neutral[800],
  '--color-text-muted': colors.neutral[500],
  '--color-text-subtle': colors.neutral[400],
  '--color-border': colors.neutral[200],
  '--color-border-light': colors.neutral[100],
  '--shadow-sm': shadows.sm,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
  '--radius-sm': borderRadius.sm,
  '--radius-md': borderRadius.md,
  '--radius-lg': borderRadius.lg,
  '--radius-xl': borderRadius.xl,
};
