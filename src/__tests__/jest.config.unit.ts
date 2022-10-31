module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['mocks', 'integration'],
  testMatch: ['**/unit/**/*.test.js'],
  reporters: ['default', './jest-test-reporter.js'],
}

