module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  timers: 'fake',
  testRegex: '(/src.+__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
