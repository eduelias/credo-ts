import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '@credo-ts/(.+)': [
      '<rootDir>/../../../packages/$1/src',
      '<rootDir>/../../packages/$1/src',
      '<rootDir>/../packages/$1/src',
    ],
  },
  verbose: true,
  coveragePathIgnorePatterns: ['/build/', '/node_modules/', '/__tests__/', 'tests'],
  coverageDirectory: '<rootDir>/coverage/',
  testTimeout: 30000,
}

export default config
