const { serverless } = require('@probot/serverless-lambda')

const plugin = (robot) => {
  robot.log(':robot1: says wassup')
  robot.on('issues.opened', context => {
    robot.log('Received', context.event + '.' + context.payload.action)
    // return context.github.issues.createComment(context.issue({body: 'Thanks for opening this issue! :tada:'}))
  })
}

module.exports.probot = serverless(plugin)
