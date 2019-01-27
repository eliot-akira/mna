const startOfWeek = require('date-fns/start_of_week')
const endOfWeek = require('date-fns/end_of_week')
const startOfMonth = require('date-fns/start_of_month')
const endOfMonth = require('date-fns/end_of_month')
const eachDay = require('date-fns/each_day')
const formatDate = require('date-fns/format')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const weekdayShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const getMonthName = day => monthNames[day.month - 1]
const getWeekdayName = day => weekdayNames[day.dayOfWeek>0 ? day.dayOfWeek-1 : 6]
const getWeekdayShortName = day => weekdayShortNames[day.dayOfWeek>0 ? day.dayOfWeek-1 : 6]

const getDayData = day => {

  const p = formatDate(day, 'YYYY Q M W D d H m s')
    .split(' ')
    .map(i => parseInt(i, 10))

  return {
    year: p[0],
    quarter: p[1],
    month: p[2],
    week: p[3],
    day: p[4],
    dayOfWeek: p[5],
    hour: p[6],
    minute: p[7],
    second: p[8],
  }
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

const isSameDay = (first, second) =>
  first.year===second.year
  && first.month===second.month
  && first.day===second.day

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