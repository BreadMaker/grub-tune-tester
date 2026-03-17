export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      quotes: ["error", "single"],
      indent: ["error", 2]
    }
  }
];