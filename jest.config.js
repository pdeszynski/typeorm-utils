
module.exports = {
  verbose: true, // [boolean]

  rootDir: '.',
  testEnvironment: 'node',

  // Modules can be explicitly auto-mocked using jest.mock(moduleName).
  // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
  automock: false, // [boolean]

  // Respect Browserify's "browser" field in package.json when resolving modules.
  // https://facebook.github.io/jest/docs/en/configuration.html#browser-boolean
  browser: false, // [boolean]

  // This config option can be used here to have Jest stop running tests after the first failure.
  // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
  bail: false, // [boolean]

  // https://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
  coverageDirectory: '<rootDir>/test-reports/coverage', // [string]

  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoveragefrom-array
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "json"],

  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1",
  },
  transform: {
    "^.+\\.ts$": "ts-jest"
  },

  globals: {
    __DEV__: true,
    __TEST__: true,
  },
}

