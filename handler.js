const aws = require("aws-sdk")
const ses = new aws.SES()

module.exports.send = (event, context, callback) => {
  const myEmail = process.env.EMAIL
  const { email, name, content } = JSON.parse(event.body)

  const emailParams = {
    Source: myEmail,
    Destination: {
      ToAddresses: [myEmail]
    },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `
            Message sent from email ${email} by ${name}
            Content: ${content}
          `
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "You received a message from adnanrahic.com!"
      }
    }
  }

  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      console.log(err)
      return callback(null, {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://adnanrahic.com',
          'Access-Control-Allow-Headers': 'x-requested-with',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(err)
      })
    }


    console.log(data)
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://adnanrahic.com',
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data)
    })
  })
}