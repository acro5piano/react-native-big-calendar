import typescript2 from 'rollup-plugin-typescript2'
import jsx from 'acorn-jsx'

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
  external: (id) => !id.startsWith('.') && !id.startsWith('/') && id !== 'tslib',
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
