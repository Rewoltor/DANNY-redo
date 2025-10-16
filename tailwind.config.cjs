const tokens = require('./tokens.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        bg: tokens.colors.bg,
        surface: tokens.colors.surface,
        muted: tokens.colors.muted,
        text: tokens.colors.text,
        accent: tokens.colors.accent,
        accent2: tokens.colors['accent-2']
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.sans.split(', '),
        mono: tokens.typography.fontFamily.mono.split(', ')
      }
    }
  },
  plugins: []
}
