(function(){

  /* Setup visibility listener so we can pause the animation when page is no longer visible and
  prevent really speed up ugly animations */

  // Set the name of the hidden property and the change event for visibility
  //TODO Properly Handle The Transition Property So It Doesnt Cramb Up when the page is visible again!!!!!
  //TODO Problem Solved By switching off degrees/transform incr when page is not visible, however it can cause some
  // unsync time errors

  var hidden, visibilityChange,
  isPageVisible = true;

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

  if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    // Browser Doesn't Support Visibility API so we have to know how many people don't support it
    console.log('Browser Doesn\'t Support Visibility API!');
  } else {
    console.log('Page Visibility Listener Registered');
    document.addEventListener(visibilityChange, handleVisibility, false);
  }

  function handleVisibility() {
    if (document[hidden]) {
      console.log('Document was hidden');
      isPageVisible = false;
    } else {
      console.log('Document was shown');
      isPageVisible = true;
    }
  }

  // Clock
  var now, munDate, timeDiff, diffDate, diffH, diffHours, diffM, diffMinutes, dayConv, hrsConv;

  now = new Date();
  tjmunDate = new Date(2016, 11, 8);

  timeDiff = Math.abs(tjmunDate.getTime() - now.getTime());
  diffDate = new Date(timeDiff);

  hrsConv = 1000 * 3600;
  dayConv = hrsConv * 24;

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


  setInterval(function() {

    // Update Label Values
    secEl.innerHTML = secs;
    minEl.innerHTML = mins;
    hrsEl.innerHTML = hrs;
    dayEl.innerHTML = days;

    // If Page Is Not Visible Don't Rotate The Image so it doesn't get buggy after page becomes visible again
    if(isPageVisible)
      degs += incr;

    // Rotate Image
    imgEl.style.transform = "rotateZ("+ degs +"deg)";

    secs--;
    if(secs <= -1) {
      secs = 59;
      mins--;
    }
    if(mins <= -1) {
      mins = 59;
      hrs--;
    }
    if(hrs <= -1) {
      hrs = 23;
      days--;
    }
    if(days <= -1) {
        //TODO MUN Starts HERE!!!
    }

  }, 1000);



})();
