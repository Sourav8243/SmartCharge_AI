export const Colors = {
  primary: '#00D4AA',
  primaryDark: '#00A888',
  primaryLight: '#33DDBB',
  secondary: '#0A84FF',
  secondaryDark: '#0066CC',
  accent: '#FF6B35',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  critical: '#FF2D55',

  background: '#0A0E17',
  backgroundSecondary: '#111827',
  backgroundTertiary: '#1A2332',
  surface: '#1E293B',
  surfaceLight: '#253347',
  card: '#162032',
  cardBorder: '#1E3A5F',

  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textMuted: '#475569',

  batteryHigh: '#34C759',
  batteryMedium: '#FF9500',
  batteryLow: '#FF3B30',
  batteryCritical: '#FF2D55',

  gradientStart: '#00D4AA',
  gradientEnd: '#0A84FF',
};

export const Typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 36,
    hero: 48,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const CHARGING_TYPES = [
  { key: 'CCS', label: 'CCS Combo', icon: 'zap' },
  { key: 'CHAdeMO', label: 'CHAdeMO', icon: 'zap-off' },
  { key: 'Type2', label: 'Type 2 AC', icon: 'plug' },
  { key: 'Tesla', label: 'Tesla Supercharger', icon: 'battery-charging' },
];

export const TRAFFIC_LEVELS = [
  { key: 'low', label: 'Low Traffic', color: Colors.success },
  { key: 'medium', label: 'Medium Traffic', color: Colors.warning },
  { key: 'high', label: 'High Traffic', color: Colors.error },
];
