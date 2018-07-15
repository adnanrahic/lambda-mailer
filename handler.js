const aws = require('aws-sdk')
const ses = new aws.SES()
const myEmail = process.env.EMAIL
const myDomain = process.env.DOMAIN

function generateResponse(code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(payload)
  }
}

function generateEmailParams(body) {
  const { email, name, content } = JSON.parse(body)
  return {
    Source: myEmail,
    Destination: {
      ToAddresses: [myEmail]
    },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${email} by ${name} \nContent: ${content}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You received a message from ${myDomain}!`
      }
    }
  }
}

module.exports.send = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body)
    const data = await ses.sendEmail(emailParams).promise()
    return generateResponse(200, data)
  } catch (err) {
    return generateResponse(500, err)
  }
}