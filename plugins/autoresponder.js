module.exports = (robot) => {
  robot.log(':robot: says wassup')
  robot.on('issues.opened', context => {
    return context.github.issues.createComment(context.issue({body: 'Thanks for opening this issue! :tada:'}))
  })
}
