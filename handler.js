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
  webhookPath: '/webhook',
  port: 0
})

// Load the local probot plugins
probot.setup([require('./plugins/autoresponder')])
module.exports.webhook = function (event, context, callback) {
  // Determine incoming webhook event type
  // Checking for different cases since node's http server is lowercasing everything
  const e = event.headers['x-github-event'] || event.headers['X-GitHub-Event']

  // Convert the payload to an Object if API Gateway stringifies it
  event.body = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body

  // Do the thing
  probot.receive({
    event: e,
    payload: event.body
  })
  .then(() => {
    const res = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Executed'
      })
    }
    callback(null, res)
  })
}

const express = require('express')
const path = require('path')
// Override the default folders so they can be accessed
probot.server.use('/probot/static', express.static(path.join(process.cwd(), 'static')))
probot.server.set('views', path.join(process.cwd(), 'views'))

const awsServerlessExpress = require('aws-serverless-express')
const probotServer = awsServerlessExpress.createServer(probot.server)

exports.router = (event, context) => awsServerlessExpress.proxy(probotServer, event, context)
