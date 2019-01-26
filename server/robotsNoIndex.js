
get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send("User-agent: *\nDisallow: /")
})
