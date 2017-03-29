// ==UserScript==
// @name        genjson
// @namespace   donot.help
// @include     http://jwgl.cust.edu.cn/teachweb/index1.aspx
// @include     http://210.47.0.14/teachweb/index1.aspx
// @version     1
// @grant       none
// ==/UserScript==
'use strict';
//console.log('fuck1');
//var prestyle = '    height: auto;    max-height: 200px;    overflow: auto;    background-color: #eeeeee;    word-break: normal !important;    word-wrap: normal !important;    white-space: pre !important;';
var LINGResultJSON = {};
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
window.allAdded=0;
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
}
window.genjson = function (xml) {
  // var root = xml.getElementById('Table1').lastChild;
  var rootTable = xml.getElementById('Table1');
  var time,day;
  var row,cell;
  var cellTabels,cellContent;
  var lectureTable,index;
  var lessonName,teacherName;
  var lecture,lectureHash;
  var lctn,weeks,weekstr;
  var trs;
  var timetable = {
    name : '2016-2017 第二学期',
    lessons:{}
  };

  for (time=1;time<=6;time++){
    row = rootTable.rows[time];
    for (day=1;day<=7;day++){
      console.log('('+day+','+time+')');
      cell = row.cells[day];
      trs = cell.getElementsByTagName('table')[0].getElementsByTagName('tr').length;
      if (trs == 6){
        //empty cell
        continue;
      }else if (trs == 5) {
        // single lecture
        cellTabels = cell.getElementsByTagName('table');
      }else {
        // multi lecture
        cellTabels = cell.getElementsByTagName('table')[0].getElementsByTagName('table');
      }
      // get Content
      for (index=0;index<cellTabels.length;index++){
        lectureTable = cellTabels[index];
        lessonName = lectureTable.getElementsByTagName('tr')[0].getElementsByTagName('td')[0].innerText.replace(" (试)","");
        teacherName = lectureTable.getElementsByTagName('tr')[1].getElementsByTagName('td')[0].innerText;
        lctn = lectureTable.getElementsByTagName('tr')[2].getElementsByTagName('td')[0].innerText;
        weekstr = lectureTable.getElementsByTagName('tr')[3].getElementsByTagName('td')[0].innerText;
        // console.log('      ('+day+','+time+')'+lessonName+'-'+teacherName+'@'+lctn+'|'+weekstr);

        lectureHash = (lessonName+teacherName).hashCode();
        if (timetable.lessons[lectureHash] === undefined) {
          timetable.lessons[lectureHash] = {
            teacher : {name : teacherName},
            name : lessonName,
            time_locations : []
          };
        }
        timetable.lessons[lectureHash].time_locations.push({
           // section:[tim*2-1,tim*2],
           location:lctn,
           start_section:time*2-1,
           end_section:time*2,
           weekday:day,
           weeks:weeksParse(weekstr)
         });


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
  console.log(timetable);
  var LINGResultJSON = {
    ver : '0.1',
    timetable : timetable
  };
  window.location = "lingapp://"+encodeURI(JSON.stringify(LINGResultJSON));
  return JSON.stringify(LINGResultJSON);
}
window.showjson = function () {
  var printCourse = 'http://jwgl.cust.edu.cn/teachweb/kbcx/Report/wfmRptPersonalCourses.aspx?role=student';
  const xhr = new XMLHttpRequest;
  xhr.responseType="document";
  xhr.open('get', printCourse, true);
  xhr.send(null);
  //xhr.overrideMimeType('text/xml');
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        //console.log('ok');
        /*
        var copyButton = document.createElement('button')
        todo: imp this
        }*/
        return genjson(xhr.response);

      }
    }
  }
} //alert(document.getElementById('schoolImage').attributes.background.value);

var lobj = window.showjson();
