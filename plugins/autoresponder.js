const commands = require('probot-commands')
const stats = require('./stats')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = (robot) => {
  commands(robot, '/slash', async (context, command) => {
    const github = await robot.app.asInstallation(context.payload.installation.id)
    return github.issues.createComment(context.issue({ body: 'I got you!' }))
  })

  robot.on('issues.opened', async context => {
    const github = await robot.app.asInstallation(context.payload.installation.id)
    return github.issues.createComment(context.issue({ body: 'Thanks for opening this issue! :tada:' }))
  })

  const app = robot.route('/tcbyrd')

  app.get('/', (req, res) => {
    res.end('PONG')
  })

  app.get('/:page', (req, res) => {
    res.end(`PONG ${req.params.page}`)
  })

}

module.exports = stats
