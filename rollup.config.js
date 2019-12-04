import typescript from '@rollup/plugin-typescript'
import jsx from 'acorn-jsx'

export default {
  input: './src/index.ts',
  acornInjectPlugins: [jsx()],
  plugins: [typescript()],
  external: id => !id.startsWith('.') && !id.startsWith('/') && id !== 'tslib',
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
