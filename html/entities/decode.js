
export default function decode(str) {

  // TODO: More robust HTML entity decode?
  // https://github.com/substack/node-ent

  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec)
    })
}
