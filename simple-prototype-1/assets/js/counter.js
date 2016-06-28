(function(){

  var now, munDate, timeDiff, diffDate, diffH, diffHours, diffM, diffMinutes, dayConv, hrsConv;
  now = new Date();
  tjmunDate = new Date(2016, 11, 8);

  timeDiff = Math.abs(tjmunDate.getTime() - now.getTime());
  diffDate = new Date(timeDiff);

  hrsConv = 1000*3600;
  dayConv = hrsConv*24;

  diffDays    = Math.floor(timeDiff / (dayConv) );
  diffH       = diffDate - (diffDays * (dayConv) )
  diffHours   = Math.floor(diffH / (hrsConv) );


  diffM       = diffH - (diffHours * (hrsConv) );
  diffMinutes = Math.floor(diffM / (1000 * 60) );


  var imgEl = document.getElementById('counter-img'),
      secEl = document.getElementById('label-sec'),
      minEl = document.getElementById('label-mins'),
      hrsEl = document.getElementById('label-hrs'),
      dayEl = document.getElementById('label-days'),
      degs = 0,
      incr = 360/60,
      secs = 59,
      mins = diffMinutes,
      hrs  = diffHours,
      days = diffDays;
  // imgEl.style.transform = "rotateZ("+ degs +"deg)";
  setInterval(function() {
    secEl.innerHTML = secs;
    minEl.innerHTML = mins;
    hrsEl.innerHTML = hrs;
    dayEl.innerHTML = days;
    imgEl.style.transform = "rotateZ("+ degs +"deg)";
    // if(degs == 360) degs = 0;
    degs += incr;
    secs--;
    if(secs <= -1) {
      secs = 59;
      mins--;
      // degs+=360;
      // imgEl.style.transform = "rotateZ("+ degs +"deg)";

    }
    if(mins <= -1) {
      mins = 59;
      hrs--;
    }
    if(hrs <= -1) {
      hrs = 23;
      days--;
    }
  }, 1000);


})();
