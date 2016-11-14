var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var optimalYratio = 390/640;

var pWidth = Math.min(window.innerWidth, 640),
    pHeight = Math.floor(pWidth*optimalYratio),
    behindHeight = pHeight * 1.2;
var letterEl = document.querySelector('.letter-box');
var letterRect = letterEl.getBoundingClientRect();


function onYouTubeIframeAPIReady() {
  player = new YT.Player('player-box', {
    height: pHeight.toString(),
    width: pWidth.toString(),
    videoId: 'IhrvbtfCIeI',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  var playerEl = document.getElementById('player-box');
  var hOffset = ((letterRect.width - pWidth) / 2).toString() + 'px';
  var vOffset = ((behindHeight - pHeight) / 2).toString() + 'px';
  playerEl.style.marginLeft = hOffset;
  playerEl.style.marginTop = vOffset;

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
}
function stopVideo() {
  player.stopVideo();
}
