/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#b78926',
        'brand-gold-light': '#f2cf76',
        'brand-red': '#7a2c1d',
        'brand-cream': '#f7eee3',
        'brand-black': '#111827',
        'brand-matte': '#e5d4b2',
        'brand-yellow': '#f9c846',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 20px 45px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
