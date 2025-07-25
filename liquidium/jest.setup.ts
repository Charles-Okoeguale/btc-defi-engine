import type { Config } from 'jest';
import nextJest from 'next/jest';
const { TextEncoder, TextDecoder } = require('util');
import '@testing-library/jest-dom';

// Set up window object
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// For jsdom environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'TextEncoder', {
    writable: true,
    value: TextEncoder
  });
  Object.defineProperty(window, 'TextDecoder', {
    writable: true,
    value: TextDecoder
  });
}

// Reset mocks between tests
beforeEach(() => {
  jest.resetModules();
});

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

// Any custom config you want to pass to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (if you use them in your Next.js project)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/'
  ],
  transform: {
    // Use ts-jest for TypeScript files
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
    }],
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/'
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
export default createJestConfig(customJestConfig);