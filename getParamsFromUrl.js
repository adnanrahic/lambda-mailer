module.exports = (url) =>
  decodeURIComponent(url)
    .split('&')
    .reduce((acc, curr) => {
      const [key, value] = curr.split('=')
      acc[key] = value
      return acc
    }, {})
