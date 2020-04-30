module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  timers: 'fake',
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
