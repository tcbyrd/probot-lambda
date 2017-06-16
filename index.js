require.include('probot')
const createProbot = require('./probot');
const fs = require('fs')

require('file-loader?name=private-key.pem!./private-key.pem')
const cert = fs.readFileSync('private-key.pem', 'utf8')

const probot = createProbot({
  id: process.env.APP_ID,
  secret: process.env.WEBHOOK_SECRET,
  cert: cert,
  port: 0
});

probot.load(require('./autoresponder'));

module.exports.probotHandler = function (event, context, callback) {
  const e = event.headers['X-GitHub-Event']
  const payload = JSON.parse(event.body)
  const id = event.headers['X-GitHub-Delivery']

  probot.robot.webhook.emit(e, {
    id: id,
    payload: payload
  })

  const res = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Executed',
      payload: payload
    })
  }

  callback(null, res)

}
