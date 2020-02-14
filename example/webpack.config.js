const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/index.tsx',
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-eval-source-map',
  output: {
    filename: isProduction ? '[name].[chunkhash].js' : 'bundle.js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.ts', '.tsx', '.ts', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
      'react-native-big-calendar': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        lodash: {
          test: /[\\/]node_modules[\\/](lodash|lodash-es)[\\/]/,
          name: 'lodash',
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-native-web|react-native)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
      },
    },
  },
}
