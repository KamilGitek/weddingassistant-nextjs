import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': 'rgb(245 245 220)',
        'color-secondary': 'rgb(240 240 240)',
        'color-accent': 'rgb(212 175 55)',
        'color-accent-dark': 'rgb(184 134 11)',
        'color-bg-main': 'rgb(250 250 248)',
        'color-bg-card': 'rgb(255 255 255)',
        'color-bg-dark': 'rgb(44 44 44)',
        'color-text-primary': 'rgb(44 44 44)',
        'color-text-secondary': 'rgb(107 107 107)',
        'color-text-light': 'rgb(158 158 158)',
        'color-success': 'rgb(76 175 80)',
        'color-error': 'rgb(244 67 54)',
        'color-warning': 'rgb(255 152 0)',
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'Arial', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'slideInUp': 'slideInUp 0.6s ease-out forwards',
        'fadeIn': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInUp: {
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          'to': {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
