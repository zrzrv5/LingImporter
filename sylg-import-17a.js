
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

function weeksParse(rawString) {
  var weeks=[],spec="";
  if(rawString.split("|")[1]){
    spec=rawString.split("|")[1];
  }
  var startWeek=rawString.replace("{第",'').split("周")[0].split("-")[0];

  var endWeek=rawString.replace("{第",'').split("周")[0].split("-")[1];

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
}

var LINGResultJSON = {
  ver:'0.1'

};

var timetable = {
  name : '',
  lessons : []
}
var ifdoc = document.getElementById('iframeautoheight').contentWindow.document;
var lessontable = ifdoc.getElementById('Table1');
if (lessontable == undefined){
  alert('请点击个人课表后再尝试导入');
}

var infotable = ifdoc.getElementById('Table2');
var semn1 = '';
var semn2 = '';
var opts = infotable.getElementsByTagName('option');
for (i in opts) {
  if (opts[i].getAttribute("selected") == "selected"){
    if (semn1 == ''){
      semn1 = opts[i].innerText;
    }else{
      semn2 = opts[i].innerText;
      break;
    }
  }
}

timetable.name = semn1+'学年第'+semn2+'学期';

// var lessontable = document.getElementById('Table1');

var day=0,time=0;
var r,c;
var cell;
var text;
var lessons,lesson;
var lessonName,teacherName;
var lecture,lectureHash;
var lctn,weeks,weekstr;
for(time=0;time<13;time++){
  for(day=1;day<8;day++){
	r = lessontable.rows[time].cells.length - 8 + day;
    cell = lessontable.rows[time].cells[r];

    if (cell == undefined || cell.innerText.length < 10) {
      // is lesson cell

      continue;

    }else{


      text = cell.innerText;


      lessons = text.split('\n\n');
      
      for (c in lessons){

        lesson = lessons[c].split('\n');
        lessonName = lesson[0];
console.log('('+time+','+r+','+day+')|'+lesson);
        weekstr = lesson[1];
        weeks = weekstr.match("\{(.*?)\}")[0];
        teacherName = lesson[2];
        lctn = lesson[3];
		
        lectureHash = (lessonName+teacherName).hashCode();

        if (timetable.lessons[lectureHash]===undefined){
          timetable.lessons[lectureHash]={
            teacher:{name : teacherName},
            name:lessonName,
            time_locations:[]
          };
        }
        timetable.lessons[lectureHash].time_locations.push({
          // section:[tim*2-1,tim*2],
          location:lctn,
          start_section:time-1,
          end_section:time,
          weekday:day,
          weeks:weeksParse(weeks)
        });
      }
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
  start_time : '08:55',
  end_time : '09:40'
},{
  section : 3,
  start_time : '10:00',
  end_time : '10:45'
},{
  section : 4,
  start_time : '10:55',
  end_time : '11:40'
},{
  section : 5,
  start_time : '13:00',
  end_time : '13:45'
},{
  section : 6,
  start_time : '13:55',
  end_time : '14:40'
},{
  section : 7,
  start_time : '14:50',
  end_time : '15:35'
},{
  section : 8,
  start_time : '15:45',
  end_time : '16:30'
},{
  section : 9,
  start_time : '16:40',
  end_time : '17:25'
},{
  section : 10,
  start_time : '17:35',
  end_time : '18:20'
},{
  section : 11,
  start_time : '20:50',
  end_time : '21:35'
},{
  section : 12,
  start_time : '21:45',
  end_time : '22:30'
}];

LINGResultJSON.timetable = timetable;
LINGResultJSON.section_rules = sections;


window.location = "lingapp://"+encodeURI(JSON.stringify(LINGResultJSON)).replace(/\//g,'|');
