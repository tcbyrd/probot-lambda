const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

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
    },
    {
      test: /package.json/,
      loaders: ['file-loader'],
      exclude: [
        path.resolve(__dirname)
      ]
    }],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './views', to: 'views/' },
      { from: './static', to: 'static/' }
    ])
  ],
  output: {
    libraryTarget: 'commonjs',
    path: __dirname + '/.webpack',
    filename: 'handler.js'
  },
};
