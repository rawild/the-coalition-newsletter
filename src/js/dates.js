var now = new Date()
now.setHours(0)
module.exports = {
  getToday: function() {
    return now
  },
  getWeek: function() {
    var week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    week.setHours(23)
    return week
  },
  getQuarter: function() {
    var quarter = new Date(now.getTime() + 12 * 7 * 24 * 60 * 60 * 1000)
    quarter.setHours(23)
    return quarter
  }
}