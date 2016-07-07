const webpack = require('webpack')
const path = require('path')

const webpackConfig = {
  context: path.resolve(),
  entry: {
    main: [
      path.resolve('example/index.js')
    ],
  },

  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/',
  },

  node: {
   fs: 'empty',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: '/node_modules/',
        include: path.resolve('example'),
        loader: 'babel',
        query: { compact: 'auto' },
      },
      { test: /\.css$/, loaders: [
          './src/loader.js',
          'css',
        ],
      },
      { test: /\.mcss$/,
        loaders: [
          './src/loader.js',
          { loader: 'css', query: { modules: true, localIdentName: '[name]__[local]___[hash:base64:5]' } },
        ],
      },
    ],
  },
}

module.exports = webpackConfig
