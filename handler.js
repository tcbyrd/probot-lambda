const { serverless } = require('./probot')
const plugin1 = require('./plugins/autoresponder')
const plugin2 = require('./plugins/somethingElse')

module.exports.probot1 = serverless(plugin1)

module.exports.probot2 = serverless(plugin2)
