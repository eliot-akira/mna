
const log = (...args) => console.log('@mna/content/api/route', ...args)

module.exports = function createRoute({ server, content, auth, actions }) {

  const { post, send, status, sendError } = server

  return post('/api', async (req, res) => {

    const { user } = req.context
    const apiProps = { ...req.body, auth, user, content, req, res }

    try {
      send(res, status.ok, await actions.api(apiProps))
    } catch (e) {

      log(e)

      send(res, status.error, e.message || e)
    }
  })
}
