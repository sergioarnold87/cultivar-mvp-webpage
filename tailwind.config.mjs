/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg-surface': '#F8FAFC',
        'text-main': '#1E293B',
        'brand-green': {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
          dark: '#081C15',
        },
        'cta-orange': {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
        },
      },
    },
  },
  plugins: [],
};
