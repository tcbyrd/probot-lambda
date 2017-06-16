const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: ['babel-polyfill', './index.js'],
  externals: [
    nodeExternals()
  ],
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        __dirname
      ],
    }],
  },
};
