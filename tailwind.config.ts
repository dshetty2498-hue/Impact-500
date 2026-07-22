import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111F",
        panel: "#0D1728",
        elevated: "#13233A",
        accent: "#3B82F6",
        cyan: "#60A5FA",
      },
    },
  },
  plugins: [],
} satisfies Config;
