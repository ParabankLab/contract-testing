module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  verbose: true,
  testTimeout: 30000 // Give Pact mock server ample time to start/stop
};