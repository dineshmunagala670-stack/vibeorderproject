import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. We define the "name" of the animation and how long it lasts
      animation: {
        'gradient-slow': 'move-bg 18s ease infinite',
      },
      // 2. We define the "instructions" for the movement
      keyframes: {
        'move-bg': {
          '0%, 100%': { 
            'background-position': '0% 50%' 
          },
          '50%': { 
            'background-position': '100% 50%' 
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;