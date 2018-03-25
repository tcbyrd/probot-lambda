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

#### Probot Serverless Method
TODO:
 - rewrite this section

#### [Serverless Framework](https://github.com/serverless/serverless)
There are a few different tools that help with testing to deploying serverless applications to AWS, but in general they all do a few things:
 1. Package your code and dependencies in a .zip file and upload it to S3
 2. Provision supporting services such as API Gateway, S3, and CloudWatch Logging using templates.
 3. Give you a way to test functions locally.

The Serverless Framework is what's being demonstrated here, chosen mainly because of its solid documentation, ecosystem of plugins, and its active community.

If you've never built a web application with serverless architectures, the important thing to understand is that Lambda functions are only a piece of that puzzle. There are a [number of events](https://serverless.com/framework/docs/providers/aws/events/) that can trigger a function. For web applications, you'll also need to provision an [API Gateway](https://serverless.com/framework/docs/providers/aws/events/apigateway/) endpoint that triggers the function. The Serverless Framework handles this for you by allowing you to specify the http endpoint and method in `serverless.yml` as an event handler for the Probot function.

By default, Serverless uses [Lambda-Proxy](https://serverless.com/framework/docs/providers/aws/events/apigateway/), meaning it passes the entire HTTP request to the handler as an `event`. This allows Probot to process the headers and payload of the webhook just like it does on the server. However, it does transform the body of the request, so the payload must be parsed in the function before being processed by your plugin. Hence, the presence of `payload: JSON.parse(event.body)` in the example above.

#### Supporting `async/await` in AWS Lambda
- TODO: rewrite this to talk about TypeScript
