const startOfWeek = require('date-fns/start_of_week')
const endOfWeek = require('date-fns/end_of_week')
const startOfMonth = require('date-fns/start_of_month')
const endOfMonth = require('date-fns/end_of_month')
const eachDay = require('date-fns/each_day')
const formatDate = require('date-fns/format')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const weekdayShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const getMonthName = arg =>
  monthNames[
    typeof arg==='object' ? arg.month - 1
      : arg - 1
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
  getDayData,
  getMonthData,
  getMonthName,
  weekdayNames,
  weekdayShortNames,
  getWeekdayName,
  getWeekdayShortName
}
