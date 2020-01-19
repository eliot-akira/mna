const startOfWeek = require('date-fns/start_of_week')
const endOfWeek = require('date-fns/end_of_week')
const startOfMonth = require('date-fns/start_of_month')
const endOfMonth = require('date-fns/end_of_month')
const eachDay = require('date-fns/each_day')
const formatDate = require('date-fns/format')
const isFutureDate = require('date-fns/is_future')
const isPastDate = require('date-fns/is_past')
const isTodayDate = require('date-fns/is_today')
const isValidDateCheck = require('date-fns/is_valid')
const differenceInDays = require('date-fns/difference_in_days')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const weekdayShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const toPlainObject = (day, defaultKey = 'day') =>
  day instanceof Date
    ? getDayData(day)
    : typeof day!=='object'
      ? { [defaultKey]: day }
      : day

const toDate = (day) =>
  day instanceof Date
    ? day
    : Array.isArray(day)
      ? new Date(day[0], day[1] - 1, day[2])
      : typeof day==='object'
        ? new Date(day.year, day.month - 1, day.day)
        : (() => {
          const len = day.length
          let y, m, d
          if (len===8) {
            // YYYYMMDD
            y = day.slice(0, 4)
            m = day.slice(4, 6)
            d = day.slice(6, 8)
          } else {
            // Assume YYYY-MM-DD
            const dayParts = day.split(' ')
            const dayPart = dayParts[0]
            ;[ y, m, d ] = dayPart.split('-')
          }
          return new Date(y, m - 1, d)
        })()

const isFuture = d => isFutureDate(toDate(d))
const isPast = d => isPastDate(toDate(d))
const isToday = d => isTodayDate(toDate(d))
const isValidDate = d => {

  let isValid = false
  const dateInstance = toDate(d)

  try {
    isValid = isValidDateCheck(dateInstance)
  } catch(e) { /**/ }

  // Make sure date exists, i.e., Feb 31st
  if ( isValid && ! (d instanceof Date)) {
    const check = getDayData(dateInstance)
    isValid = ['year', 'month', 'day'].reduce((pass, key) => {
      if (!pass) return false
      return check[key]==d[key]
    }, isValid)
  }
  return isValid
}

const diffDays = (d1, d2) => differenceInDays(toDate(d1), toDate(d2))

const getMonthName = arg =>
  monthNames[
    typeof arg==='object'
      ? arg.month - 1
      : (arg - 1)
  ]

const getWeekdayName = arg =>
  weekdayNames[
    typeof arg==='object' ? (arg.dayOfWeek>0 ? arg.dayOfWeek-1 : 6)
      : (arg>0 ? arg-1 : 6)
  ]

const getWeekdayShortName = arg =>
  weekdayShortNames[arg.dayOfWeek>0 ? arg.dayOfWeek-1 : 6]

const isSameDay = (first, second) =>
  first.year===second.year
  && first.month===second.month
  && first.day===second.day

const getDayData = day => {

  const p = formatDate(day, 'YYYY Q M W D d H m s')
    .split(' ')
    .map(i => parseInt(i, 10))

  return [
    'year', 'quarter', 'month',
    'week', 'day', 'dayOfWeek',
    'hour', 'minute', 'second'
  ].reduce((obj, key, index) => {
    obj[key] = p[index]
    return obj
  }, {})
}

const getMonthData = day => {

  const weekStartsOn = 1

  const startDay = startOfWeek(
    startOfMonth(day)
    , { weekStartsOn })

  const endDay = endOfWeek(
    endOfMonth(day)
    , { weekStartsOn })

  const daysOfMonth = eachDay(startDay, endDay)

  // Group by weeks
  const weeks = []

  for (let i = 0, len = daysOfMonth.length; i < len; i++) {

    const weekIndex = Math.floor(i / 7)

    if (!weeks[weekIndex]) {
      weeks[weekIndex] = []
    }

    const data = getDayData(daysOfMonth[i])

    weeks[weekIndex].push(data)
  }

  return { weeks }
}

export {
  isSameDay,
  isFuture,
  isPast,
  isToday,
  isValidDate,

  toDate,
  diffDays,

  getDayData,
  getMonthData,
  getMonthName,
  weekdayNames,
  weekdayShortNames,
  getWeekdayName,
  getWeekdayShortName,
}
