module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.pact.test.ts'],
  setupFiles: ['./jest.setup.js'],
  verbose: true,
  testTimeout: 30000
};