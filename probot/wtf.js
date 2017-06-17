module.exports = robot => {
  robot.on('issues', async context => {
    robot.log(context, "sweet", context.payload)
  });
}
