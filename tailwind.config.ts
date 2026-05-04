import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fffaf3",
        sand: {
          50: "#faf7f2",
          100: "#f3eadc",
          200: "#e8d8c3",
          300: "#d8bea2",
          400: "#c49d77",
          500: "#ae8059",
          600: "#926447",
          700: "#76503b",
          800: "#604232",
          900: "#50372b",
        },
        terracotta: {
          50: "#fdf1ea",
          100: "#f9dfcf",
          200: "#f3bea1",
          300: "#ea966b",
          400: "#df7040",
          500: "#cf5529",
          600: "#b84222",
          700: "#98331f",
          800: "#7d2d20",
          900: "#68291f",
        },
        clay: {
          50: "#fbf7f3",
          100: "#f3e8de",
          200: "#e7d0bd",
          300: "#d6ad8f",
          400: "#c48663",
          500: "#b36b48",
          600: "#985239",
          700: "#7e4231",
          800: "#68372c",
          900: "#573027",
          950: "#3a1f18",
        },
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["Nunito", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(87, 48, 39, 0.35)",
      },
    },
  },
  plugins: [forms],
};

export default config;
