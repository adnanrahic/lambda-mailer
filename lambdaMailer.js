const aws = require('aws-sdk')
const ses = new aws.SES()

module.exports = (options) => {
  const { myEmail, myDomain } = options

  function generateResponse (code, payload) {
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': myDomain,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(payload)
    }
  }

  function generateError (code, err) {
    console.log(err)
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': myDomain,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(err.message)
    }
  }

  function generateEmailParams (body) {
    const { email, name, content } = JSON.parse(body)
    console.log(email, name, content)
    if (!(email && name && content)) {
      throw new Error('Missing parameters! Make sure to add parameters \'email\', \'name\', \'content\'.')
    }

    return {
      Source: myEmail,
      Destination: { ToAddresses: [myEmail] },
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

  async function lambdaMailer (event) {
    try {
      const emailParams = generateEmailParams(event.body)
      const data = await ses.sendEmail(emailParams).promise()
      return generateResponse(200, data)
    } catch (err) {
      return generateError(500, err)
    }
  }

  return lambdaMailer
}
