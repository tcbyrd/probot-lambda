- [ ] move robot.auth to context
- [ ] robot.config(plugin) - loads plugin config from package.json
  - [ ] context.config - loads config from repository
- [ ] error handling in scripts
- [ ] Generate app
  - https://www.npmjs.com/package/create-project
  - `probot new` - like  https://github.com/vuejs/vue-cli


Use Cases:
- merging a PR automatically once all checks on a PR successfully ran through?
- https://gitmagic.io/
- https://var.ci/
- https://github.com/foosel/GitIssueBot
- http://symfony.com/blog/calling-for-issue-triagers-a-new-workflow-and-the-carson-butler
- https://github.com/nodejs/github-bot
- https://github.com/fat/haunt
- https://github.com/fastlane/issue-bot
- https://github.com/botdylan/botdylan
- https://github.com/servo/servo/issues/13430#issuecomment-249532065
- https://github.com/kubernetes/contrib/tree/master/mungegithub
- Jekyllbot reviving discussion https://github.com/jekyll/jekyll/issues/5207#issuecomment-252759570
- PR Bot that automatically brings PRs up-to-date with master

Other ideas based on [github-gardener](https://github.com/deliciousbrains/github-gardener)

- Check for open PRs ready for review that are not mergeable, and adds a label and comment to the author.
- Checks for un-deleted branches on closed PRs, excluding branches with 'release' in their name.
- Closes issues that have been resolved by a PR to a non-master branch
- Remove redundant labels from closed PRs
