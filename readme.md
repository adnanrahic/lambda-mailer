![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)
![contributors](https://img.shields.io/badge/contributors-1-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![license](https://img.shields.io/badge/eslint-standard-yellowgreen.svg)

<img src="https://raw.githubusercontent.com/adnanrahic/cdn/master/lambda-mailer/lambda-mailer.png" alt="cover" width="100%">

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
const { sendJSON, sendFormEncoded } = require('lambda-mailer')(options)

// Content-Type: application/json
// The event.body needs to be a JSON object with 3 properties
// - email
// - name
// - content
module.exports.sendJSON = sendJSON

// Content-Type: application/x-www-form-urlencoded
// The event.body needs to a URI encoded string with 3 parameters
// - email
// - name
// - content
module.exports.sendFormEncoded = sendFormEncoded

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
  sendJSON:
    handler: handler.sendJSON
    events:
      - http:
          path: email/send/json
          method: post
          cors: true
  sendFormEncoded:
    handler: handler.sendFormEncoded
    events:
      - http:
          path: email/send/formencoded
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
  https://{id}.execute-api.{region}.amazonaws.com/{stage}/email/send/json
```

#### 6. Send a regular form POST request to the API Gateway endpoint

Send a POST request using an HTML form. Sample below shows a simple HTML form.

```html
<form action="https://{id}.execute-api.{region}.amazonaws.com/{stage}/dev/email/send/formencoded" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="content" required></textarea>
</form>
```

By default the request will redirect back to the initial page the request was sent from. You can edit the `redirectUrl` by adding it as a query string parameter. Example below.

```html
<form action="https://{id}.execute-api.{region}.amazonaws.com/{stage}/dev/email/send/formencoded?redirectUrl=https://someotherdomain.com" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="content" required></textarea>
</form>
```

---

Enjoy using the module. Feel free to open issues or feature requests. :smile: