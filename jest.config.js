module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.pact.test.ts'],
  verbose: true,
  testTimeout: 30000
};