module.exports = function(robot) {
  robot.on('issues.opened', async context => {
    const github = await robot.integration.asInstallation(context.payload.installation.id);
    return github.issues.createComment(context.issue({ body: 'Thanks for opening this issue! :tada:' }));
  });
}
