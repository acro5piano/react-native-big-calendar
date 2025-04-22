const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

import custom from './webpack.config.js'

module.exports = {
  stories: ['../stories/*.stories.tsx'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  addons: [
    '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-react-native-web',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['react-native-reanimated'],
        babelPlugins: [
          '@babel/plugin-proposal-export-namespace-from',
          'react-native-reanimated/plugin',
        ],
      },
    },
  ],

  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    config.plugins.push(new NodePolyfillPlugin())

    return {
      ...config,
      ...custom,
    }
  },
}
