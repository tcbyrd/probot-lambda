module.exports = (robot) => {
  robot.log(':robot2: says wassup')
  robot.on('issues.opened', context => {
    robot.log('Received something else:', context.event + '.' + context.payload.action)
    // return context.github.issues.createComment(context.issue({body: 'Thanks for opening this issue! :tada:'}))
  })
}
