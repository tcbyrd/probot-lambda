// Webpack setup
require.include('probot')
// If using webpack, uncomment this line to ensure
// it inludes your private-key in the resulting bundle.
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

// Load Probot plugins from the `./plugin` folder
// You can specify plugins in an `index.js` file or your own custom file by providing
// a primary entry point in the "main" field of `./plugin/package.json`
// https://docs.npmjs.com/files/package.json#main
probot.load(require('./plugin'));

// Lambda Handler
module.exports.autoResponder = function (event, context, callback) {
  // Determine incoming webhook event type
  // Checking for different cases since node's http server is lowercasing everything
  const e = event.headers['x-github-event'] || event.headers['X-GitHub-Event']

  // Convert the payload to an Object if API Gateway stringifies it
  event.body = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body

  try {
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

  } catch (err) {
    console.log(err)
    callback(err)
  }

}
