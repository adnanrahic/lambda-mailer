const options = {
  myEmail: process.env.EMAIL,
  myDomain: process.env.DOMAIN
}
const { sendJSON, sendFormEncoded } = require('./lambdaMailer')(options)
module.exports.sendJSON = sendJSON
module.exports.sendFormEncoded = sendFormEncoded
