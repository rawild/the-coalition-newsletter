var ical = require("node-ical");
var rrule = require("rrule").RRule;
const fs = require("fs");

var now = new Date()
now.setHours(0)
var week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
week.setHours(23)

ical.fromURL("http://the-coalition.berlin/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events", {}, function(err, data) {
    if (err) throw err;
    var events = getEvents(data)
    var writer =  fs.createWriteStream('./src/data/newsletter_'+ now.getDate() + '_' + (now.getMonth()+1) + '.json');
    writer.write(JSON.stringify(events))
})


function getEvents(data) {
  var events = new Array()
  for (var k in data){
    
    if(data.hasOwnProperty(k)){
      var event = data[k]
      if(Date.parse(event.end) > now || event.rrule !== undefined){
      if (event.rrule !== undefined){
         var trule = event.rrule.toString().search("FREQ")
          var rule = rrule.fromString(event.rrule.toString().slice(trule))
          var list = rule.between(now, week)
          
            if (list) {
              for( var i in list){
                var event_edited = event
                //console.log(event)
                // console.log (list[i])
                var newDate = new Date(Date.parse(list[i]))
                var oldDate = new Date(Date.parse(event.start))
                event_edited.start = transferTime(newDate, oldDate)
                
                var newEndDate = new Date(Date.parse(list[i]))
                oldEndDate = new Date(Date.parse(event.end))
                event_edited.end = transferTime(newEndDate, oldEndDate)
                events.push(event_edited)
              }
            }
          } else{
            events.push(event)
          } 
        }
        
      }
    }
    if (events.length > 0) {
      return events
    }
}

function transferTime(toDate, fromDate){
  if(!toDate instanceof Date || !fromDate instanceof Date) {
    throw error;
  }
  toDate.setHours(fromDate.getHours())
  toDate.setMinutes(fromDate.getMinutes())
  return toDate
}