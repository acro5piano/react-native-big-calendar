const path = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack') // ← これを追加

module.exports = ({ config }) =>
  merge(config, {
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  noEmit: false,
                },
              },
            },
          ],
        },
      ],
    },

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

    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
      }),
    ],
  })
