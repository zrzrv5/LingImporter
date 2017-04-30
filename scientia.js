
var maxWeek = 24;

function parseWeek(str){
  var strs = str.split(',');
  var i,j;
  var weeks = [];
  for (i=0;i<strs.length;i++){
    var strss = strs[i].split('-');
    var section = [];
    var t;
    for (j=0;j<strss.length;j++){
      var s = strss[j].replace('w','');
      if (!isNaN(parseInt(s))) {
        section.push(parseInt(s));
      }
    }
    section.sort()
    if (section.length == 1){
      weeks.push(section[0])
    }else if (section.length == 2) {
      for (t=section[0];t<=section[1];t++){
        if (t>maxWeek){
          maxWeek = t;
        }
        weeks.push(t);
      }
    }

  }
  var tempSet = new Set(weeks);

  var result = Array.from(tempSet);
  return result.sort();
}

String.prototype.hashCode = function () {
    var hash = 0,
        i,
        chr,
        len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var timetable = {
  name : "asd",
  lessons : {},
  week_count : maxWeek
};

var body = document.getElementsByTagName('body')[0];
var lessonsTable = body.children[1];

var day,cellIndex,timeStartIndex,timeEndIndex;
var cell;
var nameStr,locationStr,timeStr,teacherStr;
var hash;
var timebar = lessonsTable.rows[0];
for (day=1;day<8;day++){

  timeStartIndex = 0;
  timeEndIndex = 0;
  for (cellIndex=0;cellIndex<lessonsTable.rows[day].cells.length;cellIndex++){
    // console.log('('+day+','+cellIndex+')');
    cell = lessonsTable.rows[day].cells[cellIndex];

    timeStartIndex = timeEndIndex;
    if (isNaN(parseInt(cell.getAttribute('colspan')))) {
      timeEndIndex = timeStartIndex + 1;
    }else{
      timeEndIndex = timeStartIndex + parseInt(cell.getAttribute('colspan'));
    }

     if (cell.childElementCount == 3) {
        nameStr = cell.children[0].innerText;
        locationStr = cell.children[1].getElementsByTagName('td')[0].innerText;
        timeStr = cell.children[1].getElementsByTagName('td')[1].innerText;
        teacherStr = cell.children[2].innerText;
        // console.log(nameStr+'@'+locationStr+'|'+timeStr+'('+teacherStr+')');
        // console.log('['+timebar.cells[timeStartIndex].innerText+'~'+timebar.cells[timeEndIndex].innerText+']'+nameStr);
        console.log(timeStr);

        if (timetable.lessons[nameStr] === undefined){
          timetable.lessons[nameStr] = {
            teacher:{name:teacherStr},
            name:nameStr,
            time_locations:[]
          };
        }
        timetable.lessons[nameStr].time_locations.push(
          {
            location : locationStr,
            start_time : timebar.cells[timeStartIndex].innerText,
            end_time: timebar.cells[timeEndIndex].innerText,
            weekday : day,
            weeks : parseWeek(timeStr)
          }
        )

     }
  }
}

var tpl = timetable.lessons;
var lessonArray = new Array();
var hashKeys = new Array();
  for (var key in tpl) {
   hashKeys.push(key);
   lessonArray.push(tpl[key]);
}
timetable.lessons = lessonArray;
timetable.week_count = maxWeek;

console.log(timetable);

var LINGResultJSON = {ver:'0.1',timetable:timetable};
window.location = "lingapp://"+encodeURI(JSON.stringify(LINGResultJSON));
