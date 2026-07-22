const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: __dirname });
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
      "eslint.config.js",
      "prettier.config.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

module.exports = config;
