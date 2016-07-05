(function(){

  /* Setup visibility listener so we can pause the animation when page is no longer visible and
  prevent really speed up ugly animations */

  // Set the name of the hidden property and the change event for visibility
  //TODO Properly Handle The Transition Property So It Doesnt Cramb Up when the page is visible again!!!!!
  //TODO Problem Solved By switching off degrees/transform incr when page is not visible, however it can cause some
  // unsync time errors


  var hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  var pageIsVisible = true;

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
    if(pageIsVisible)
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

  if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    console.log('Browser Doesn\'t Support Visibility API!');
  } else {
    console.log('Adding Visibility Listener');
    document.addEventListener(visibilityChange, handleVisibility, false);
  }
  //imgEl.classList.remove('animatable');
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  function handleVisibility() {
    console.log('Visibility Has Changed!');
    if (document[hidden]) {
      console.log('Document was hidden');
      pageIsVisible = false;
    } else {
      console.log('Document was shown');
      pageIsVisible = true;
    }

  }

})();
