var days = require("./week.js")
var dates = require("./dates.js")
var now = dates.getToday()
var week = dates.getWeek()
var quarter = dates.getQuarter()
var struct = require("./structures.js")
var exception = require("./exception.js").exception()
var ical = require("ical")
var eventsParser = require("./events.js") 
module.exports = {
  
  writeNewsletter: function() {
    var request = new Request('https://the-coalition.berlin/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events&no_html=true')
    fetch(request).then(function(response) {
      return response.text().then(function(text){
        return ical.parseICS(text)
      }).then(function(data) {
          var events = eventsParser.getEvents(data)
          let app = document.getElementById('app');
          app.insertAdjacentHTML("beforeend","<b>Announcements: </b>")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "<br>")
          let tCEvents = events.filter(checktCEvent)
          printEvents(app, tCEvents, true)
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "Events from Coalition Participants: ")
          app.insertAdjacentHTML("beforeend", "<br>")
          let otherEvents = events.filter(checkOtherEvent)
          printEvents(app, otherEvents, false)
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "<b>The Week's News Wrap Up by Jara:</b>")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "<a href='http://www.the-coalition.berlin'>the-coalition.berlin</a>")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "<a href='https://www.facebook.com/thecoalitionberlin/'>Facebook</a>")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "<a href='https://twitter.com/TheCoalitionDE'>Twitter</a>")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "To subscribe to this newsletter - email: cuf-newsletter-subscribe@lists.riseup.net")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "To unsubscribe - email: cuf-newsletter-unsubscribe@lists.riseup.net")
          app.insertAdjacentHTML("beforeend", "<br>")
          app.insertAdjacentHTML("beforeend", "To submit events to this newsletter - email: newsletter@the-coalition.berlin")
  })

  })  
}
  
}

function printEvents(app, events, bold){
  events.sort(function(a, b){
    var d1 = new Date(Date.parse(a.start))
    var d2 = new Date(Date.parse(b.start))
    return d1 - d2})
  printWeekList(app, events, bold)
  if(bold){
    app.insertAdjacentHTML("beforeend", "<b>"+struct.divider+"</b>")
  }else{
    app.insertAdjacentHTML("beforeend", struct.divider)
  }
  printLaterList(app, events, bold)
}

function printWeekList(app, events, bold){
  var currDate = now
  var currNum = 1
  var dateString = getDateString(currDate)
  for(var i in events) {
    var event = events[i]
    var start = new Date(Date.parse(event.start))
    var end = new Date(Date.parse(event.end))
    if (start <= week ) {
      if ((currDate === now && start.getDate() === currDate.getDate())|| start.getDate() > currDate.getDate() || start.getMonth() > currDate.getMonth()){
        currDate = start
        currNum = 1
        dateString = getDateString(currDate)
        if(bold){
          app.insertAdjacentHTML("beforeend", "<b>"+struct.divider+"</b>")
        }else{
          app.insertAdjacentHTML("beforeend", struct.divider)
        }
        app.insertAdjacentHTML("beforeend", "<br>")
        if(bold){
          app.insertAdjacentHTML("beforeend","<b>"+days.getDay(start.getDay()) + " " + dateString + "." + getMonthString(start)+"</b>")
        }else{
          app.insertAdjacentHTML("beforeend",days.getDay(start.getDay()) + " " + dateString + "." + getMonthString(start))
        }
        app.insertAdjacentHTML("beforeend", "<br>")
      } 
        app.insertAdjacentHTML("beforeend", "<br>")
        if(bold){
          app.insertAdjacentHTML("beforeend", "<b>"+currNum + ") ")
          app.insertAdjacentHTML("beforeend", "<b>"+event.summary+"</b>")
        }else{
          app.insertAdjacentHTML("beforeend", currNum + ") ")
          app.insertAdjacentHTML("beforeend", event.summary)
        }
        app.insertAdjacentHTML("beforeend", "<br>")
        app.insertAdjacentHTML("beforeend","Time: " + getEventTime(start, end));
        app.insertAdjacentHTML("beforeend", "<br>")
        app.insertAdjacentHTML("beforeend", "Where: " + event.location )
        app.insertAdjacentHTML("beforeend", "<br>")
        app.insertAdjacentHTML("beforeend","More info <a href =" + getContactLink(event.contact) + '>here</a>')
        app.insertAdjacentHTML("beforeend", "<br>")

        currNum++  
    }

  }
}


function printLaterList(app, events, bold){
  app.insertAdjacentHTML("beforeend", "<br>")
  if(bold){
    app.insertAdjacentHTML("beforeend", "<b>Can't make those? Mark your calendar:</b>")
  }else{
    app.insertAdjacentHTML("beforeend", "Can't make those? Mark your calendar:")
  }
  app.insertAdjacentHTML("beforeend", "<br>")
  app.insertAdjacentHTML("beforeend", "<br>")
  var currDate = week
  var dateString = getDateString(currDate)
  for(var i in events) {
    var event = events[i]
    var start = new Date(Date.parse(event.start))
    var end = new Date(Date.parse(event.end))
    // console.log(JSON.stringify(week) + " " + JSON.stringify(start) + " " + event.summary)
    if (start > week && start < quarter) {
      if (start.getDate() > currDate.getDate() || start.getMonth() > currDate.getMonth()){
        currDate = start
        dateString = getDateString(currDate)
      }
      if(bold){
        app.insertAdjacentHTML("beforeend", "<b>"+struct.bullet+"</b>")
      }else{
        app.insertAdjacentHTML("beforeend", struct.bullet)
      }
      if(bold){
        app.insertAdjacentHTML("beforeend","<b>" + days.getDay(start.getDay()) + " </b>")
      }else{
        app.insertAdjacentHTML("beforeend", days.getDay(start.getDay()) + " ")
      }
      if(bold){
        app.insertAdjacentHTML("beforeend","<b>" + dateString + "." + getMonthString(start) + " </b>")
      }else{
        app.insertAdjacentHTML("beforeend", dateString + "." + getMonthString(start) + " ")
      }
      if(bold){
        app.insertAdjacentHTML("beforeend", "<b>"+ getEventTime(start, end)+ " ")
        app.insertAdjacentHTML("beforeend", "<b>"+event.summary + " ")
      }else{
        app.insertAdjacentHTML("beforeend", getEventTime(start, end) + " ")
        app.insertAdjacentHTML("beforeend", event.summary + " ")
      }
      var link = getContactLink(event.contact)
      if(link){
        app.insertAdjacentHTML("beforeend", "- More info <a href =" + getContactLink(event.contact) + '>here</h>')
      }
      app.insertAdjacentHTML("beforeend", "<br>")


    }

  }
  app.insertAdjacentHTML("beforeend", struct.divider)
}
function getContactLink(list) {
  var array = list.split(';')
  for (var i in array){
    if (array[i].startsWith('http') || array[i].startsWith(' http')){
      return array[i]
    }
  }
}

function getTime(date){
  if(!date instanceof Date) {
    throw exception('not a real time', 'DateException')
  }
  var min = JSON.stringify(date.getMinutes())
  if (min.length < 2){
    min = 0 + min
  }
  var time_str = JSON.stringify(date.getHours())+":"+min
  return time_str
}
function getEventTime(start, end){
   var startTime = getTime(start)
   var endTime = getTime(end)
   if (startTime === "0:00" && endTime === "0:00"){
     return "[All Day]"
   } else {
     return startTime + "-" + endTime
   }
   
}

function checktCEvent(event) {
  if(event.TAGS){
    return (event.TAGS.val.includes('thecoalition'))
  } else {
    return false
  }
}
function checkOtherEvent(event) {
  if(event.TAGS){
    return(!event.TAGS.val.includes('thecoalition'))
  } else {
    return true
  }
}
function getMonthString(date) {
  if(date.getMonth() < 9){
    return ("0" + (date.getMonth() + 1))
  } else {
    return (date.getMonth() + 1)
  }
}

function getDateString(date){
  if (date.getDate() < 10) {
    return "0" + date.getDate()    
  }else{
    return date.getDate()
  }
}
