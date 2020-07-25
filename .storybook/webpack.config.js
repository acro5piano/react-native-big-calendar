const path = require('path')
const { merge } = require('webpack-merge')

module.exports = ({ config }) =>
  merge(config, {
    resolve: {
      modules: ['node_modules'],
      extensions: [
        '.web.ts',
        '.web.tsx',
        '.web.js',
        '.web.jsx',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
      ],
      alias: {
        'react-native': path.resolve(__dirname, '../node_modules/react-native-web'),
        '@storybook/react-native': path.resolve(__dirname, '../node_modules/react-native-web'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  jsx: 'react',
                },
              },
            },
          ],
        },
      ],
    },
  })
