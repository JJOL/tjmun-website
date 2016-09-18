function initMap() {

  var schoolPos = {
    lat: 20.5880556,
    lng: -100.38805555555557
  };

  map = new google.maps.Map(document.getElementById('gmap'), {
    center: schoolPos,
    zoom: 8
  });
  marker = new google.maps.Marker({
    position: schoolPos,
    map: map,
    title: "ITJ Querétaro"
  });
}
