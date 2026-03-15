import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef7ed",
          100: "#fdecd4",
          200: "#fad5a8",
          300: "#f6b871",
          400: "#f19038",
          500: "#ee7413",
          600: "#df5a09",
          700: "#b94209",
          800: "#93350f",
          900: "#772d10",
        },
      },
    },
  },
  plugins: [],
};

export default config;
