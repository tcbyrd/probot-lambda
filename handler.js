// Yet another change
// Webpack setup
require.include('probot')
require('file-loader?name=private-key.pem!./private-key.pem')

const fs = require('fs')
const cert = fs.readFileSync('private-key.pem', 'utf8')

// Probot setup
const createProbot = require('./probot');
const probot = createProbot({
  id: process.env.APP_ID,
  secret: process.env.WEBHOOK_SECRET,
  cert: cert,
  port: 0
})

// Load the local probot plugins
probot.setup([require('./plugins/autoresponder'), require('./plugins/web-ui'), require('./plugins/stats')])

// Proxy the lambda event handler into `probot.server```
const serverless = require('serverless-http')
module.exports.router = serverless(probot.server)
