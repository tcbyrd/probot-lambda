const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: ['babel-polyfill', './handler.js'],
  externals: [
    nodeExternals()
  ],
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: [
        __dirname
      ],
    }],
  },
  output: {
    libraryTarget: 'commonjs',
    path: __dirname + '/.webpack',
    filename: 'handler.js'
  },
};
