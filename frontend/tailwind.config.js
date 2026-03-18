/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:      ['DM Sans', 'sans-serif'],
        display:   ['Fraunces', 'serif'],
      },
      colors: {
        red: {
          DEFAULT: '#E53E3E',
          dark:    '#C53030',
          light:   '#FFF5F5',
        },
        dark:    '#1A1A2E',
        panel:   '#16213E',
        cvtext:  '#2D3748',
        muted:   '#718096',
        border:  '#E2E8F0',
        success: '#38A169',
        warning: '#D69E2E',
      },
    },
  },
  plugins: [],
};
