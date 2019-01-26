const { post, json } = require('../index')

module.exports = function() {

  // Parse JSON payload

  return  post('*', async (req, res) => {
    try {
      req.body = await json(req)
    } catch (e) { /**/ }
  })
}
