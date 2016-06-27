(function(){


  var imgEl = document.getElementById('counter-img'),
      secEl = document.getElementById('label-sec'),
      minEl = document.getElementById('label-mins'),
      hrsEl = document.getElementById('label-hrs'),
      dayEl = document.getElementById('label-days'),
      degs = 0,
      incr = 360/60,
      secs = 59,
      mins = 10,
      hrs  = 10,
      days = 10;
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
