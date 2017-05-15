window.WEBSITE = window.WEBSITE || {};
WEBSITE.applyMachineEffect = function (elem, eff) {

  var listOfWord = eff.words;
  var tgl = true;

  function updateTxt(newText) {
    elem.innerHTML = newText;
  }

  function changeWord(newWord) {
    var currWord = elem.innerHTML;
    if(!tgl) {
      return;
    }
    eraseWord(currWord, function() {
      writeWord(newWord, 0, looker);
    });
  }

  function wordLooker() {
    var index = 0;
    var max = listOfWord.length-1;
    return function lookUp() {
      index = (++index > max) ? 0 : index;
      setTimeout(changeWord(listOfWord[index]), 2000);
    }
  }

  function eraseWord(text, cb) {
    var newchars = text.split('');
    if(newchars.length === 0) {
      return cb();
    }


    var reducedText = newchars.splice(0, newchars.length-1).join('');
    updateTxt(reducedText);

    setTimeout(function() {
      eraseWord(reducedText, cb);
    }, 100);
  }

  function writeWord(text, index, cb) {

    var newchars = text.split('');
    index = index || 0;

    if((newchars.length+1) == index) {
      setTimeout(cb, 2000);
      return;
    }


    var reducedText = newchars.splice(0, index).join('');
    updateTxt(reducedText);

    setTimeout(function() {
      writeWord(text, index+1, cb);
    }, 100);
  }


  var looker = wordLooker();
  looker();
  return function(toggle) {
    tgl = toggle;
    if(tgl) {
      looker();
    }
  }
}
