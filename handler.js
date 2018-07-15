const options = {
  myEmail: process.env.EMAIL,
  myDomain: process.env.DOMAIN
}
const lambdaMailer = require('./lambdaMailer')(options)
module.exports.send = lambdaMailer
