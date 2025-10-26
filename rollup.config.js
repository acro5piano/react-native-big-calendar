import jsx from 'acorn-jsx'
import typescript2 from 'rollup-plugin-typescript2'

const baseConfig = {
  acornInjectPlugins: [jsx()],
  plugins: [
    typescript2({
      tslib: require('tslib'),
      declaration: true,
      tsconfig: 'tsconfig.prod.json',
    }),
  ],
  external: (id) => !id.startsWith('.') && !id.startsWith('/') && id !== 'tslib',
}

export default [
  // Main entry point (with native dependencies)
  {
    ...baseConfig,
    input: './src/index.ts',
    output: [
      {
        file: 'build/index.js',
        format: 'cjs',
        name: 'react-native-big-calendar',
        sourcemap: true,
      },
      {
        file: 'build/index.es.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Legacy entry point (without native dependencies)
  {
    ...baseConfig,
    input: './src/legacy.ts',
    output: [
      {
        file: 'build/legacy.js',
        format: 'cjs',
        name: 'react-native-big-calendar-legacy',
        sourcemap: true,
      },
      {
        file: 'build/legacy.es.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
]
