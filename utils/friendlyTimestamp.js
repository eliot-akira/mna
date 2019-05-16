function pad(n) {
  return n < 10 ? '0'+n : n
}

export default function friendlyTimestamp() {
  const now = new Date()

  // Return datetime in UTC: 201905160115

  return `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`
}
