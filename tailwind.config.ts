import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vietnam identity palette
        'vn-red': '#DA251D',
        'vn-red-deep': '#8F1713',
        'vn-gold': '#FFCD00',
        'vn-gold-antique': '#D4A72C',
        'vn-ivory': '#F4EBD8',
        'vn-brown': '#6A4932',
        'vn-charcoal': '#11100E',
        'vn-black': '#080808',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-be-vietnam)', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        cinematic: '0.35em',
        wide2: '0.18em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
