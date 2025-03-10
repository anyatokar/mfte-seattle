import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/dist/**",
      "**/termly/**",
      "**/*.test.{js,jsx,ts,tsx}",
      "**/__tests__/**",
      "**/tests/**",
    ],
  },
  // Base config for all files
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactJsxRuntime,
  {
    rules: {
      // JavaScript rules
      "no-unused-vars": "warn",
      "no-undef": "warn",

      // React rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
