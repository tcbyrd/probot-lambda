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

// Proxy the lambda event handler into `probot.server```
const serverless = require('serverless-http')
const express = require('express')
const path = require('path')
// Override the default folders so they can be accessed
probot.server.use('/probot/static', express.static(path.join(process.cwd(), 'static')))
probot.server.set('views', path.join(process.cwd(), 'views'))

module.exports.router = serverless(probot.server)
