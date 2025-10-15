// design-system/tailwind.config.ts
import type { Config } from 'tailwindcss';
import tokens from './tokens.json';

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
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
      borderRadius: {
        md: tokens.radii.md,
        lg: tokens.radii.lg
      },
      boxShadow: {
        md: tokens.shadows.md
      }
    }
  },
  plugins: []
};

export default config;
