import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: { colors: { ink: "#050816", panel: "#111827", accent: "#4F7EFF", cyan: "#6EE7F9" } },
  },
  plugins: [],
} satisfies Config;
