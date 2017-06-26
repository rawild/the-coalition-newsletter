var dates = require("./dates.js")
var now = dates.getToday()
var file = require("../data/newsletter_"+now.getDate()+"_"+(now.getMonth()+1)+".json")
exports.getEventsFromFile = function() {
  return file;

};

exports.getEvents = function(data) {
  var events = []
  for (var k in data){
    
    if(data.hasOwnProperty(k)){
      var event = data[k]
      if(Date.parse(event.end) > now || event.rrule !== undefined){
      
        events.push(event)
          
      }
        
    }
  }
  if (events.length > 0) {
    return events
  }
}

