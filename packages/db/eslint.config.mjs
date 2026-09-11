import baseConfig from "../config/eslint/base.js";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Add db specific rules if needed
    }
  }
];
