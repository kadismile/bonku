module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['mocks', 'unit'],
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/integration/**/*.test.js'],
  reporters: ['default', './jest-test-reporter.js'],
}

