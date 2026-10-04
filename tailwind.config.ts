import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1118",
        panel: "#111922",
        elevated: "#17212C",
        accent: "#4D8997",
        cyan: "#6FB6C4",
      },
    },
  },
  plugins: [],
} satisfies Config;
