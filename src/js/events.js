var ical = require("node-ical");
var rrule = require("rrule");
var dates = require("./dates.js")
var now = dates.getToday()
var week = dates.getWeek()
var file = require("../data/newsletter_"+now.getDate()+"_"+(now.getMonth()+1)+".json")
const fs = require("fs");
var exception = require("./exception.js").exception()
exports.getEventsFromFile = function() {
  return file;

};

exports.getEventsFromURL = function() {
  ical.fromURL("http://the-coalition.berlin/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events&no_html=true", {}, function(err, data) {
      if (err) throw err;
      fs.createWriteStream('../out/newsletter'+ now.getDate() + '_' + (now.getMonth()+1) + '.txt');
      var events = getEvents(data)
      return(events)
    });
}

function getEvents(data) {
  var events = []
  for (var k in data){
    
    if(data.hasOwnProperty(k)){
      var event = data[k]
      if(Date.parse(event.end) > now || event.rrule !== undefined){
      if (event.rrule !== undefined){
         var trule = event.rrule.search("FREQ")
          var rule = rrule.fromString(event.rrule.slice(trule))
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
                var oldEndDate = new Date(Date.parse(event.end))
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
    throw exception('not an instance of Date', 'DateException');
  }
  toDate.setHours(fromDate.getHours())
  toDate.setMinutes(fromDate.getMinutes())
  return toDate
}