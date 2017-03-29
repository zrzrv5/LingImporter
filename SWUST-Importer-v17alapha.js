//author: .Del (Z@limlabs.xyz)
//newer to JavaScript.
//need open timetable page first.
//Can't import directly from index page.
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
window.weeksParse = function (rawString) {
  var weeks=[],spec="";
  if(rawString.split(",")[1]){
    spec=rawString.split(",")[1];
  }
  var startWeek=rawString.split(",")[0].split("周")[0].split("-")[0];
  var endWeek=rawString.split(",")[0].split("周")[0].split("-")[1];
  if(endWeek){
    for(var i=parseInt(startWeek);i<=parseInt(endWeek);i++){
      if(spec=="单周"&& i%2 ==0){
        continue;
      }
      if(spec=="双周"&& i%2 !==0){
        continue;
      }
      weeks.push(i);
    }
  }
  else{
    weeks=[parseInt(startWeek)];
  }
  return weeks;
};

var title = document.getElementsByClassName('uiHeaderTitle')[0];

window.allAdded=0;
var timetable = {
  name : title.innerText.replace('- 选课课程表',''),
  lessons:{}};
var table = document.getElementById('choosenCourseTable');
var rows = table.getElementsByTagName('tr');
var time,day,index,counter,c,row,columns,columnsCount;
var lessonName,teacherName;
var lecture,lectureHash;
var lctn,weeks,weekstr;
for(time=1;time<=6;time++){
  row = rows[time];
  columns = row.getElementsByTagName('td');
  columnsCount = columns.length;
  for(day=1;day<=7;day++){
    c = columnsCount-8+day;
    // console.log(time,c);
    column = columns[c];
    if (column.getElementsByClassName('lecture').length == 1) {
      lecture = column.getElementsByClassName('lecture')[0];

      lessonName = lecture.getElementsByClassName('course')[0].innerHTML;
      teacherName = lecture.getElementsByClassName('teacher')[0].innerHTML;
      lctn = lecture.getElementsByClassName('place')[0].innerHTML;
      weekstr = lecture.getElementsByClassName('week')[0].innerHTML;
      // console.log(lessonName,'-',teacherName);
      lectureHash = (lessonName+teacherName).hashCode();
      if(timetable.lessons[lectureHash]===undefined){
       timetable.lessons[lectureHash]={
         teacher:{name : teacherName},
         name:lessonName,
         time_locations:[]
       };
     };
     timetable.lessons[lectureHash].time_locations.push({
        // section:[tim*2-1,tim*2],
        location:lctn,
        start_section:time*2-1,
        end_section:time*2,
        weekday:day,
        weeks:weeksParse(weekstr)
      });
      allAdded=allAdded+1;


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

var sections = [{
  section : 1,
  start_time : '08:00',
  end_time : '08:45'
},{
  section : 2,
  start_time : '08:50',
  end_time : '09:35'
},{
  section : 3,
  start_time : '09:55',
  end_time : '10:40'
},{
  section : 4,
  start_time : '10:45',
  end_time : '11:30'
},{
  section : 5,
  start_time : '14:00',
  end_time : '14:45'
},{
  section : 6,
  start_time : '14:50',
  end_time : '15:35'
},{
  section : 7,
  start_time : '15:55',
  end_time : '16:40'
},{
  section : 8,
  start_time : '16:45',
  end_time : '17:30'
},{
  section : 9,
  start_time : '18:00',
  end_time : '18:45'
},{
  section : 10,
  start_time : '18:50',
  end_time : '19:35'
},{
  section : 11,
  start_time : '19:55',
  end_time : '20:40'
},{
  section : 12,
  start_time : '20:45',
  end_time : '21:30'
}];
var LINGResultJSON = {
  ver : '0.1',
  timetable : timetable,
  section_rules : sections


};
window.location = "lingapp://"+encodeURI(JSON.stringify(LINGResultJSON));
