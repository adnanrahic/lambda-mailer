const options = {
  myEmail: process.env.EMAIL,
  myDomain: process.env.DOMAIN
}
const lambdaMailer = require('./lambdaMailer')(options)
// const lambdaMailer = require('lambda-mailer')(options)
module.exports.send = lambdaMailer
