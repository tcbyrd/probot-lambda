// Webpack setup
require.include('probot')
const fs = require('fs')
require('file-loader?name=private-key.pem!./private-key.pem')
const cert = fs.readFileSync('private-key.pem', 'utf8')

// Probot setup
const createProbot = require('./probot');
const probot = createProbot({
  id: process.env.APP_ID,
  secret: process.env.WEBHOOK_SECRET,
  cert: cert,
  port: 0
});
// Load the Probot plugin
probot.load(require('./autoresponder'));

// Lambda Handler
module.exports.probotHandler = function (event, context, callback) {
  // Determine incoming webhook event type
  const e = event.headers['X-GitHub-Event']

  try { // Do the thing
    probot.robot.webhook.emit(e, {
      id: event.headers['X-GitHub-Delivery'],
      payload: JSON.parse(event.body)
    })

    const res = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Executed'
      })
    }
    callback(null, res)
  } catch (err) {
    console.log(err)
    callback(err)
  }

}
