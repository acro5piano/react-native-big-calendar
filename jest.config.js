module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  timers: 'fake',
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/rndemo/build/',
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  preset: 'react-native-web',
}
