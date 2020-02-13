import typescriptDev from '@rollup/plugin-typescript'
import typescriptProd from 'rollup-plugin-typescript2'
import jsx from 'acorn-jsx'

const plugins = []

if (process.env.NODE_ENV === 'production') {
  plugins.push(typescriptProd({ tslib: require('tslib'), declaration: true }))
} else {
  plugins.push(typescriptDev())
}

export default {
  input: './src/index.ts',
  acornInjectPlugins: [jsx()],
  plugins,
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
