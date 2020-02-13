module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  timers: 'fake',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
