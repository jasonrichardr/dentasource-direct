/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A1410',
          green: '#10b981',
          orange: '#F26522',
          gray: '#86868B',
          light: '#F5F5F7',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-geist-sans)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
