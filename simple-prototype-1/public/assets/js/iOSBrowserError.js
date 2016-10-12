var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && isIOS) {
  var errDis = document.getElementById('full-error-view');
  if(errDis) {
    errDis.style.display = 'block';

    var btn =document.getElementById('full-error-view-button');
    btn.onclick = function() {
      errDis.style.display = 'none';
    }

  } else {
    console.log('Err display not found!')
  }
}
