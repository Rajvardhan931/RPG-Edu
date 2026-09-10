import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './client/components/**/*.{js,ts,jsx,tsx,mdx}', // Including this just in case
  ],
  theme: {
    extend: {
      colors: {
        'astral-blue': '#00D4FF',
        'neon-gold': '#FFD700',
        'deep-navy': '#0A0E1A',
      },
    },
  },
  plugins: [],
}
export default config