import typescript2 from 'rollup-plugin-typescript2'
import jsx from 'acorn-jsx'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default {
  input: './src/index.ts',
  acornInjectPlugins: [jsx()],
  plugins: [
    typescript2({
      tslib: require('tslib'),
      declaration: true,
      tsconfig: 'tsconfig.prod.json',
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'tslib',
  ],
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
}
