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
    : new Date(day.year, day.month - 1, day.day)

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

module.exports = {
  isSameDay,
  isFuture,
  isPast,
  isToday,
  isValidDate,

  getDayData,
  getMonthData,
  getMonthName,
  weekdayNames,
  weekdayShortNames,
  getWeekdayName,
  getWeekdayShortName,
}
