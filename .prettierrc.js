module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 120,
  trailingComma: "none",
  arrowParens: "avoid",
  overrides: [
    {
      files: "package*.json",
      options: {
        printWidth: 1000
      }
    }
  ]
}
