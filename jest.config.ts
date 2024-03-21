/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['clover', 'json', 'lcov', 'text-summary'], // Added 'text-summary'
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts', // Adjust this path according to your project structure
  ],
  coverageDirectory: 'coverage',
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
      }
  }
};
