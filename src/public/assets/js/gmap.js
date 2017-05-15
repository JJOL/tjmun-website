function initMap() {

  var schoolPos = {
    lat: 20.616223,
    lng: -100.369817
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
