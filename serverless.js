const fs = require('fs')
const cert = fs.readFileSync('private-key.pem', 'utf8')

module.exports.serverless = (plugin) => {

  const instance = (event, context, callback) => {
    // Probot setup
    const { createProbot } = require('probot-ts');
    const { resolve } = require('probot-ts/lib/resolver')

    const probot = createProbot({
      id: process.env.APP_ID,
      secret: process.env.WEBHOOK_SECRET,
      cert: cert
    })

    if (typeof plugin === 'string') {
      plugin = resolve(plugin)
    }

    probot.load(plugin)

    /**
     * AWS Lambda handler
     */

    // Ends function immediately after callback
    context.callbackWaitsForEmptyEventLoop = false

    // Determine incoming webhook event type
    // Checking for different cases since node's http server is lowercasing everything
    const e = event.headers['x-github-event'] || event.headers['X-GitHub-Event']
    const id = event.headers['x-github-delivery'] || event.headers['X-GitHub-Delivery']

    // Convert the payload to an Object if API Gateway stringifies it
    event.body = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body

    // Do the thing
    console.log(`Received event ${e}${event.body.action ? ('.' + event.body.action) : ''}`)
    if (event) {
      try {
        probot.receive({
          event: e,
          payload: event.body
        }).then(() => {
          const res = {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Executed'
            })
          }
          return callback(null, res)
        })
      } catch (err) {
        console.error(err)
        callback(err)
      }
    } else {
      console.error({ event, context })
      callback('unknown error')
    }
  }

  return instance
}
