module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["turbo", "prettier", "plugin:@typescript-eslint/recommended"],
  rules: {
    "react/jsx-key": "off",
  },
  plugins: ["@typescript-eslint"],
};
