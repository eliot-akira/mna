// https://date-fns.org/docs/Getting-Started
// https://date-fns.org/v1.30.1/docs/format

module.exports = {
  eachDay: require('date-fns/each_day'),

  formatDate: require('date-fns/format'),

  startOfMonth: require('date-fns/start_of_month'),
  endOfMonth: require('date-fns/end_of_month'),
  startOfWeek: require('date-fns/start_of_week'),
  endOfWeek: require('date-fns/end_of_week'),

  getYear: require('date-fns/get_year'),
  getQuarter: require('date-fns/get_quarter'),
  getWeek: require('date-fns/get_iso_week'),
  getMonth: require('date-fns/get_month'),

  getDayOfWeek: require('date-fns/get_day'), // 0~6
  getDay: require('date-fns/get_date'), // day of month

  getHour: require('date-fns/get_hours'),
  getMinute: require('date-fns/get_minutes'),
  getSecond: require('date-fns/get_seconds'),

  addWeeks: require('date-fns/add_weeks'),

  ...require('./cal')
}
