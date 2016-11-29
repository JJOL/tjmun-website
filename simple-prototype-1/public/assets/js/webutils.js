
var WEBSITE = WEBSITE || {};
WEBSITE.toastShowDuration = 6000;

(function(){

  var queu = [];
  var activated = false;
  var toastBox = document.getElementById('toast');

  var links = document.querySelectorAll('.mail-link');
  for(var i=0; i < links.length; i++) {
    links[i].addEventListener('click', onMailLinkClicked, false);
  }


  function onMailLinkClicked(e) {
    displayToastMessage("Opening your default mail client...")
  }
  function onEndTransition(e) {
    if(activated)
      return;

    if(queu.length > 0) {
      var msg = queu.splice(0, 1);
      displayToastMessage(msg);
    }
  }

  function displayToastMessage(msg) {

    if (activated) {
      queu.push(msg);
      console.log('Already Activated. Added To The QUEU!')
      return;
    }

    activated = true;
    toastBox.innerHTML = msg;
    toastBox.classList.add('toast-show');

    setTimeout(function() {
      toastBox.classList.remove('toast-show');
      activated = false;
      setTimeout(onEndTransition, 1000);
    }, WEBSITE.toastShowDuration);
  }

  WEBSITE.displayToastMessage = displayToastMessage;

})(WEBSITE);
