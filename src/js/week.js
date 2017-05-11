var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
module.exports = {
  printDays: function() {
      return days.toString()
  },
  getDay: function(x){
    return days[x];
  }
}