import type {Config} from "@jest/types"

const config: Config.InitialOptions = {
  "preset": "ts-jest",
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      tsconfig: './tsconfig.json',
    }],
  },
  testEnvironment: 'node', // Set the test environment to Node.js
  transformIgnorePatterns: [
    '/node_modules/', // Ignore all code in node_modules by default
  ],
  testRegex: './test/.*\\.(test|spec)?\\.(ts)$', // Match TypeScript test files
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>test'],
  verbose: true,
  automock: true,
};


export default config