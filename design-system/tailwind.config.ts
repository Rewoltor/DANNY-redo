// design-system/tailwind.config.ts
import type { Config } from 'tailwindcss';
import tokens from '../tokens.json';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: tokens.colors.bg,
        surface: tokens.colors.surface,
        muted: tokens.colors.muted,
        text: tokens.colors.text,
        accent: tokens.colors.accent,
        accent2: tokens.colors["accent-2"]
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.sans.split(', '),
        mono: tokens.typography.fontFamily.mono.split(', ')
      },
      fontSize: {
        xs: tokens.typography.fontSize.xs,
        sm: tokens.typography.fontSize.sm,
        base: tokens.typography.fontSize.base,
        lg: tokens.typography.fontSize.lg,
        xl: tokens.typography.fontSize.xl,
        '2xl': tokens.typography.fontSize['2xl'],
        '3xl': tokens.typography.fontSize['3xl'],
        '4xl': tokens.typography.fontSize['4xl']
      },
      fontWeight: {
        normal: tokens.typography.fontWeight.normal,
        medium: tokens.typography.fontWeight.medium,
        semibold: tokens.typography.fontWeight.semibold,
        bold: tokens.typography.fontWeight.bold
      },
      lineHeight: {
        tight: tokens.typography.lineHeight.tight,
        normal: tokens.typography.lineHeight.normal,
        relaxed: tokens.typography.lineHeight.relaxed
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
        '2xl': tokens.spacing['2xl']
      },
      borderRadius: {
        sm: tokens.radii.sm,
        md: tokens.radii.md,
        lg: tokens.radii.lg,
        xl: tokens.radii.xl
      },
      boxShadow: {
        sm: tokens.shadows.sm,
        md: tokens.shadows.md,
        lg: tokens.shadows.lg
      }
    }
  },
  plugins: []
};

export default config;
