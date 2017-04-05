// ==UserScript==
// @name        custedling
// @namespace   donot.help
// @include     http://m.cust.edu.cn/*
// @version     1
// @grant       none
// @author      dixyes
// @copyright   2017+, dixyes
// @license     MIT License
// ==/UserScript==

//tool func
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
window.lingJSON2Link = function(l){
  return 'lingapp://'+encodeURI(JSON.stringify(l));
}

//parser
window.parsedb = function (db) {
  function num2section(num) {
    return [(Math.floor(num / 7) + 1) * 2 - 1, (Math.floor(num / 7) + 1) * 2]
  }
  function num2weekday(num) {
    return num % 7 + 1
  }
  function arr2Int(arr){
    let x;
    for (x in arr){
      arr[x]=parseInt(arr[x]);
    }
    return arr;
  }
  var LingResultJSON = {
    'ver': 0.1,
    'timetable': {
      'name':'new one',
      'lessons':{}
    },
  };
  
  let sec,subSec,k;
  for (i = 0; i < 42; i++) {
    sec = db[i];
    if (sec !== null) {
      for (k in sec) {
        subSec = sec[k];

        var secl = {
          'name': (subSec.name + subSec.nameX).replace('(试)', ''),
          'teacher': {
            'name': subSec.teacher
          },
          'time_locations':[]
        };
        var lctn={
          'location': subSec.room,
          'start_section': num2section(i) [0],
          'end_section': num2section(i) [1],
          'weekday': num2weekday(i),
          'weeks': arr2Int(subSec.weeks.split(',')),
        }
        //console.log(secl.name+subSec.teacher+':'+(secl.name+subSec.teacher).hashCode())
        if(!LingResultJSON.timetable.lessons[(secl.name+subSec.teacher).hashCode()])
          LingResultJSON.timetable.lessons[(secl.name+subSec.teacher).hashCode()] = secl;
        //if(LingResultJSON.timetable.lessons[(secl.name+subSec.teacher).hashCode()])
          //console.log("got:"+JSON.stringify(lctn));
        LingResultJSON.timetable.lessons[(secl.name+subSec.teacher).hashCode()]["time_locations"].push(lctn);
      }
    }
  }
  var arrTt=[];
  for(i in LingResultJSON.timetable.lessons){
    //console.log(arrTt);
    arrTt.push(LingResultJSON.timetable.lessons[i]);
  } 
  LingResultJSON.timetable.lessons=arrTt;
  //window.l = LingResultJSON;
  //output
  //for ling use:
  window.location=window.lingJSON2Link(LingResultJSON);
}

//xhr part
//if you port this to any other place, use another way to do this!
const xhr = new XMLHttpRequest();
xhr.open('get', 'http://m.cust.edu.cn/schedule.html?fun=db', true);
xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      var scheduleDB = JSON.parse(xhr.responseText);
      window.parsedb(scheduleDB);
    }
  }
}
xhr.send(null);
