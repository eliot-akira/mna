
const log = (...args) => console.log('@mna/content/api/route', ...args)

export default function createRoute({ server, content, auth, actions }) {

  const { post, send, status, sendError } = server

  return post('/api', async (req, res) => {

    const { user } = req.context
    const apiProps = { ...req.body, auth, user, content, req, res }

    try {
      const result = await actions.api(apiProps)
      send(res, status.ok, result)
    } catch (e) {

      const { stack, ...error } = (typeof e==='string' ?
        { message: e }
        : e)

      send(res, status.error, error)
    }
  })
}
