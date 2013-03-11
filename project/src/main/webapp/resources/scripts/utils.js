// Like d3.time.format, but faster.
function parseDate(d) {
  return new Date(2001,
      d.substring(0, 2) - 1,
      d.substring(2, 4),
      d.substring(4, 6),
      d.substring(6, 8));
}
    
function filterJSON(json, key, value) {
  var result = {};
  for (var explosionIndex in json) {
    if (json[explosionIndex][key] === value) {
      result[explosionIndex] = json[explosionIndex];
    }
  }
  return result;
}
    
/* Extend Google Maps */
var markersArray = [];
google.maps.Map.prototype.addMarker = function(location) {
  map.clearMarkers();
      
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
      
  markersArray.push(marker);
};

google.maps.Map.prototype.addMultipleMarkers = function(location) {
      
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
      
  markersArray.push(marker);
};

    
google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i < markersArray.length; i++){
        markersArray[i].setMap(null);
    }
    this.markers = new Array();
};
