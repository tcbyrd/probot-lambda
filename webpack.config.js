const path = require('path')

module.exports = {
  entry: ['babel-polyfill', './index.js'],
  externals: /node_modules\/dtrace-provider/,
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        __dirname,
        path.resolve(__dirname, "autoresponder"),
        path.resolve(__dirname, "node_modules/probot/lib")
      ],
      unknownContextRegExp: /node_modules\/github\/.*/,
      unknownContextCritical: false,
      exprContextRegExp: /node_modules\/github\/.*/,
      exprContextCritical: false
    },
    {
      test: /\.json$/,
      loader: 'json',
      include: [
        path.resolve(__dirname, "node_modules/raven/"),
        path.resolve(__dirname, "node_modules/mime/")
      ],
    },
    {
      test: path.resolve(__dirname, "node_modules/github/lib/routes.json"),
      loader: 'file',
      query: {
        name: 'routes.json'
      }
    },
  ],
  },
};
