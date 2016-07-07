const webpack = require('webpack')
const path = require('path')

const webpackConfig = {

  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: '/node_modules/',
        include: path.resolve('example'),
        loader: 'babel',
      },
      { test: /\.css$/, loaders: [
          'style',
          'css',
          'postcss'
        ],
      },
      { test: /\.mcss$/,
        loaders: [
          'style',
          { loader: 'css', query: { modules: true, localIdentName: '[name]__[local]___[hash:base64:5]' } },
        ],
      },
    ],
  },
}

module.exports = webpackConfig
