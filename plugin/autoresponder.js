module.exports = function(robot) {
  console.log('test')
  robot.on('issues.opened', async context => {
    console.log('test inside async function')
    const github = await robot.integration.asInstallation(context.payload.installation.id);
    // const options = context.repo({path: '.github/ISSUE_REPLY_TEMPLATE.md'});
    // const data = await github.repos.getContent(options);
    // const template = new Buffer(data.content, 'base64').toString();
    return github.issues.createComment(context.issue({ body: 'Thanks for opening this issue! :tada:' }));
  });
}
