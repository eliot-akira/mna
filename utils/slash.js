
export const stripStartSlash = (s = '') =>
  s[0]==='/'
    ? s.slice(1)
    : s

export const stripEndSlash = (s = '') =>
  s[ s.length - 1]==='/'
    ? s.slice(0, -1)
    : s

export const stripSlashes = (s = '') =>
  stripStartSlash(stripEndSlash(s))
