import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          light: "#233257",
          dark: "#0C1529",
        },
        sand: {
          DEFAULT: "#E4D9C3",
          light: "#EFE8D9",
          dark: "#D2C4A3",
        },
        emerald: {
          DEFAULT: "#1B6B63",
          light: "#22857A",
          dark: "#124A44",
        },
        copper: {
          DEFAULT: "#B5652F",
          light: "#C77A44",
          dark: "#8F4E23",
        },
        charcoal: "#22262B",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-plex-arabic)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        seal: "50%",
      },
    },
  },
  plugins: [],
};

export default config;
