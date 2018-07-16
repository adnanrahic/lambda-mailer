![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)
![contributors](https://img.shields.io/badge/contributors-1-blue.svg)
![license](https://img.shields.io/github/license/mashape/apistatus.svg)
![license](https://img.shields.io/badge/eslint-standard-yellowgreen.svg)

# Lambda Mailer
Simple module for receiving an email from a contact form on your website.

# Note!
**Module needs Node.js version 8 or above.**

## Usage
Configuration is rather simple. 

#### 1. Enable your email address in the AWS console -> Simple Email Service
#### 2. Install the module
```bash
$ npm i lambda-mailer
```
#### 3. `require()` it in your `handler.js`
```js
// define the options for your email and domain
const options = {
  myEmail: process.env.EMAIL, // myEmail is the email address you enabled in AWS SES in the AWS Console
  myDomain: process.env.DOMAIN // add the domain of your website or '*' if you want to accept requests from any domain
}

// initialize the function
const lambdaMailer = require('lambda-mailer')(options)

// The event.body needs to be a JSON object with 3 properties
// - email
// - name
// - content
module.exports.send = lambdaMailer
```
#### 4. Hook it up to API Gateway in the `serverless.yml`
```yaml
service: lambda-mailer

custom:
  secrets: ${file(secrets.json)}

provider:
  name: aws
  runtime: nodejs8.10
  stage: ${self:custom.secrets.NODE_ENV}
  region: us-east-1
  profile: ${self:custom.secrets.PROFILE}
  environment: 
    NODE_ENV: ${self:custom.secrets.NODE_ENV}
    EMAIL: ${self:custom.secrets.EMAIL}
    DOMAIN: ${self:custom.secrets.DOMAIN}
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "ses:SendEmail"
      Resource: "*"

functions:
  send:
    handler: handler.send
    events:
      - http:
          path: email/send
          method: post
          cors: true
```

#### 5. Send an HTTP request to the API Gateway endpoint
Send a POST request of the type JSON with the body as stated below. The sample below is with CURL.

- request method: **POST**
- request body type: **application/json**
- request body: **{ email: String, name: String, content: String }**

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"john.doe@email.com","name":"John Doe","content":"I need some help!"}' \
  https://{id}.execute-api.{region}.amazonaws.com/{stage}/email/send
```

---

Enjoy using the module. Feel free to open issues or feature requests. :smile: