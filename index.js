const createProbot = require('probot');

const probot = createProbot({
  id: process.env.INTEGRATION_ID,
  secret: process.env.WEBHOOK_SECRET,
  cert: process.env.PRIVATE_KEY,
  port: 0
});

module.exports.probotHandler = function (event, context, callback) {
  probot.load(require('./autoresponder'));

  const e = event.headers['X-GitHub-Event']
  const payload = event.body
  const id = event.headers['X-Github-Delivery']

  probot.robot.webhook.emit(e, {
    event: e,
    id: id,
    payload: payload
  })

  const res = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Executed',
      payload: payload,
    })
  }

  callback(null, res)

}
