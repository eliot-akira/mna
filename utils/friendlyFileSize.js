
export default function friendlyFileSize(size) {

  let out = size + ' bytes'
  let units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  for (let multiple = 0, approx = size / 1024; approx > 1; approx /= 1024, multiple++) {
    out = approx.toFixed(3) + ' ' + units[multiple] //+ ' (' + size + ' bytes)'
  }
  return out
}
