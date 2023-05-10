import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/migrations/',
    '<rootDir>/seeders/'
  ],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@config(.*)$': '<rootDir>/src/config/$1',
    '@constants(.*)$': '<rootDir>/src/constants/$1',
    '@models(.*)$': '<rootDir>/src/models/$1',
    '@providers(.*)$': '<rootDir>/src/providers/$1',
    '@utils(.*)$': '<rootDir>/src/utils/$1',
    '@interceptors(.*)$': '<rootDir>/src/interceptors/$1'
  },
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts)$'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  coverageDirectory: 'coverage'
};

export default config;
