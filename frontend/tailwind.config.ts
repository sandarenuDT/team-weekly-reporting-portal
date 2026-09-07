import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B2A6B',
          DEFAULT: '#2554C7',
          600: '#2554C7',
          700: '#1E42A0',
          sky: '#5B8DEF',
          bg: '#F4F7FE',
          menu: '#0D2542'
        },
        status: {
          draft: '#6b7280',
          submitted: '#2563eb',
          needsCorrection: '#d97706',
          approved: '#16a34a',
        },
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
