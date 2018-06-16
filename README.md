## Probot on Lambda

### :octocat: + :robot: + Serverless = :heart:
This is a demonstration for how to run the [Probot](https://github.com/probot/probot/) framework on [Lambda](https://aws.amazon.com/lambda/). Due the event driven nature of bots, running Probot in a "serverless" environment can make a lot of sense. The GitHub App's Webhook just needs to point to a URL on API Gateway to receive the events, and Lambda will run the bot's logic without having to manage servers.

### Demo Setup
1. First clone this repository and install the dependencies:
```shell
$ git clone https://github.com/tcbyrd/probot-lambda.git
$ npm install
```
2. Install and configure the Serverless CLI:
```
$ npm install -g serverless
```
**Note:** Also ensure your AWS Credentials are configured. See the [Serverless Docs](https://serverless.com/framework/docs/providers/aws/guide/credentials/) for more info.

3. Register a new [GitHub App](https://developer.github.com/apps/building-integrations/setting-up-and-registering-github-apps/registering-github-apps/) and use the information from this app to configure your function's environment:
 - Create the 'Webhook Secret' and assign it to an environment variable with the name `WEBHOOK_SECRET`
 - On your app's Basic info screen, find the `ID` and assign this to an environment variable with the name `APP_ID`

   - **Note**: There are two main ways to assign environment variables programmatically for Serverless Lambda functions:
     - In the `serverless.yml` file nested under `functions: probot: environment:` or
     - Using the AWS CLI in the [`update-function-cofiguration`](http://docs.aws.amazon.com/cli/latest/reference/lambda/update-function-configuration.html) method:
    ```shell
    # Example
    aws lambda update-function-configuration --function-name lambda-probot-dev-probot --environment "Variables={APP_ID=0000,WEBHOOK_SECRET=development}"
    ```
  - Put the generated Private Key in the root directory with the filename `private-key.pem`


4. Deploy the function to AWS with the Serverless CLI:
```
$ serverless deploy
```

5. Once deployed, an API Gateway endpoint will be generated automatically. Use this as the Webhook URL in the GitHub App made above.
```
endpoints:
  POST - https://9zzzz99999.execute-api.us-east-1.amazonaws.com/dev/probot
```

This demo app is a simple [auto-responder plugin](https://github.com/tcbyrd/probot-lambda/blob/master/plugin/autoresponder.js) that sends a nice thank you message when anyone opens an issue on the installed repository.

### Architecture

#### Probot's Event Emitter
The `Robot` class in Probot implements an event emitter already, so getting this wired up to Lambda is relatively simple. Calling `webhook.emit` directly, you can pass the data coming from the HTTP Request directly to your Probot plugin:

```javascript
module.exports.probotHandler = function (event, context, callback) {
  const e = event.headers['X-GitHub-Event']
  probot.robot.webhook.emit(e, {
    event: e,
    id: event.headers['X-GitHub-Delivery'],
    payload: JSON.parse(event.body)
  })
}
```

#### [Serverless Framework](https://github.com/serverless/serverless)
There are a few different tools that help with testing to deploying serverless applications to AWS, but in general they all do a few things:
 1. Package your code and dependencies in a .zip file and upload it to S3
 2. Provision supporting services such as API Gateway, S3, and CloudWatch Logging using templates.
 3. Give you a way to test functions locally.

The Serverless Framework is what's being demonstrated here, chosen mainly because of its solid documentation, ecosystem of plugins, and its active community.

If you've never built a web application with serverless architectures, the important thing to understand is that Lambda functions are only a piece of that puzzle. There are a [number of events](https://serverless.com/framework/docs/providers/aws/events/) that can trigger a function. For web applications, you'll also need to provision an [API Gateway](https://serverless.com/framework/docs/providers/aws/events/apigateway/) endpoint that triggers the function. The Serverless Framework handles this for you by allowing you to specify the http endpoint and method in `serverless.yml` as an event handler for the Probot function.

By default, Serverless uses [Lambda-Proxy](https://serverless.com/framework/docs/providers/aws/events/apigateway/), meaning it passes the entire HTTP request to the handler as an `event`. This allows Probot to process the headers and payload of the webhook just like it does on the server. However, it does transform the body of the request, so the payload must be parsed in the function before being processed by your plugin. Hence, the presence of `payload: JSON.parse(event.body)` in the example above.

#### Supporting `async/await` in AWS Lambda
Probot requires NodeJS v7.7 and makes use of `async/await`. Since Lambda's NodeJS runtime currently uses v6.10, it doesn't natively handle this syntax. Luckily, there are some tools to help with this.

##### [Webpack](https://webpack.github.io/), [Babel-Loader](https://github.com/babel/babel-loader), and [Serverless-Webpack plugin](https://github.com/elastic-coders/serverless-webpack)
There's a lot to these tools that you can learn from the above links, but the **TL;DR** is this: Webpack looks at all the NodeJS modules in the root directory (in this case, skipping the entire `node_modules` directory) and bundles them into a single file.

While it's loading the modules, it can also transform them with [Babel](http://babeljs.io/) to work with older versions of Javascript. Generally used on the front-end to take advantage of newer features in JS in older browsers, this is also useful on the server for supporting the same new features in older versions of NodeJS.

The [`serverless-webpack`](https://github.com/elastic-coders/serverless-webpack) plugin allows you to specify this transpilation step in the `serverless.yml` file. This makes it possible to keep using `async/await` in Probot and your Probot plugins, transpile the functions to work with NodeJS v6.10, and deploy to Lambda with a single command: `sls deploy`.

The specific webpack configuration is located in [`webpack.config.js`](https://github.com/tcbyrd/probot-lambda/blob/master/webpack.config.js) and it uses [`.babelrc`](https://github.com/tcbyrd/probot-lambda/blob/master/.babelrc) to specify the babel presets and plugins. Additionally, to keep from having to bundle all of Probot's dependencies, it ignores the `node_modules` folder and instead bundles Probot from the root directory. This helps mitigate bugs that sometimes get introduced when attempting to bundle modules intended for server-side use.
