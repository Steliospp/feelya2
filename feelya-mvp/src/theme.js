// Feelya Design System V2 — Warm, human, minimal

export const colors = {
  bg: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceLight: '#F0F2F8',
  border: '#E8ECF4',
  primary: '#5B8DEF',
  primaryDark: '#4A75D4',
  primaryLight: '#EBF1FF',
  accent: '#FF9350',
  success: '#34C759',
  warning: '#FFBE0B',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
  black: '#1A1D2E',
  overlay: 'rgba(0,0,0,0.35)',
  info: '#5B8DEF',
  danger: '#EF4444',
  cardShadow: '#000',
};

// 8pt grid
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 20,
  cardPadding: 16,
};

export const radius = {
  sm: 10,
  input: 14,
  md: 16,
  lg: 20,
  xl: 28,
  full: 999,
};

// Type scale
export const font = {
  xs: 11,
  caption: 13,
  body: 15,
  section: 16,
  lg: 18,
  xl: 22,
  title: 28,
  hero: 36,
};

// Shadow presets — softer
export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 6,
  },
  fab: {
    shadowColor: '#5B8DEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
};
