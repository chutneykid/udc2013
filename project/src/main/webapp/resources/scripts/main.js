/* Constants */
CITY_CENTER = {
  sf : new google.maps.LatLng(37.7750, -122.4183),
  geneva : new google.maps.LatLng(46.2000, 6.1500),
  zurich : new google.maps.LatLng(47.3690, 8.5380)
}

DATE_FORMAT = d3.time.format("%b %Y");

/* Globals */
window.sf = new Object;
window.sf.abbr = [{"1":["001","01EXTRA"],"2":"002","3":"002-WKY","4":"002-WKY","5":"005","6":"006","7":"006","71":"006","71L":"006","8X":"008X","9":"009","9L":"009","12":["012-WKY","012"],"14":"014","16X":"016X","17":"017","18":"018","19":["019","019-WKY"],"21":"021","22":"022","23":"023","24":"024","27":"027","28":["028","028 SAT","028-WKY"],"29":"029","30":"030","30X":"130X","31":"031","33":"033","35":"035","36":"036","37":"037","38":"038","39":"039","41":"041","43":["043","043-WKY"],"44":"044","45":"030","47":["047-WKY","047"],"48":"048","49":"049","52":"052","54":"054","56":"056","59":"059","61":"61","66":"66","67":"67","80":"080","80X":"080","81X":"080","82X":"080","90":"090","91":"091","14L":"114XL","14X":"114XL","95":"095SD","38AX":"138L","38BX":"138L","1X":"101X","31X":"101X","38X":"101X", "L-OWL": "094 MC L-N OWL", "M-OWL": "094 MC L-N OWL", "N-OWL": "094 MC L-N OWL", "38L":"138L", "J":"093", "M":"093", "N":"093"}];
window.sf.routes = new Array();
    
// more styles: http://mapsys.info/34436/styled-maps-using-google-maps-api-version-3/ 
// https://gist.github.com/41latitude
var styles = [{"featureType":"administrative.country","elementType":"labels","stylers":[{"saturation":60},{"hue":"#ff00bb"},{"lightness":0}]},{"featureType":"administrative.province","elementType":"labels","stylers":[{"hue":"#ff00bb"},{"saturation":60},{"lightness":0}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry","stylers":[{"hue":"#ff00b2"},{"saturation":50},{"lightness":-20},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"gamma":0.8},{"hue":"#0099ff"},{"saturation":-80},{"lightness":10}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#ffd500"},{"visibility":"simplified"},{"saturation":-10},{"lightness":-10}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":-20},{"lightness":40}]}]
var randMcNally = [{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":-46},{"saturation":100},{"hue":"#ffee00"},{"gamma":0.94}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#2a00ff"},{"visibility":"simplified"},{"lightness":-10},{"saturation":-60}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"},{"lightness":20},{"hue":"#ff0066"},{"saturation":20}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"lightness":40}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"lightness":20}]}]
var simple = [{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]}]
var simple2 = [{"featureType":"road","elementType":"geometry","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]}]
var buildings = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}]
    
/* Setup the Google Map Enviornment */
var map;
var city = $("#city").val();

window.stops = null;
window.routes = null;
window.paths = null;
    
function initialize() {
  var mapOptions = {
    center: CITY_CENTER[city],
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
      
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  // http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
  map.setOptions({styles: simple});
  /* Show the transit layer
   * var transitLayer = new google.maps.TransitLayer();
   * transitLayer.setMap(map); 
   */
}    
    
/* Populate the List of Routes */
var routeSelect = $("#route");
var googleOptions = { strokeColor: '#00746b', strokeWeight: 1 };
var colors = ["00308F", "A32638", "841B2D", "3D0C02", "004225", "00563F", "232B2B", "013220", "004B49"]

/* Listen for City Change */
citySelect = $("#city");
loadRoutes(citySelect.val());
    
citySelect.bind("change", function(){
  var value = $(this).val();
      
  loadRoutes(value);
      
  /* Load the new city center */
  google.maps.event.trigger(map, 'resize');
  map.setCenter(CITY_CENTER[value]);
});
        
/* 
 * Routes.csv is just a list of routes, not the shape files 
 */
function loadRoutes(city) {

  var path = "resources/data/";

  d3.csv(path + city + "/routes/routes.csv", function(data) {
        
    window.routes = data;
    routeSelect.empty().append("<option>Select a route ...</option>");

    data.forEach(function(d, i){
      if (city == "sf") {
        var value = d.route_short_name + " -- " + d.route_long_name + "  " + d.route_id;
        routeSelect.append($("<option></option>").attr("value",d.route_short_name).text(value)); 
        var name = d.route_short_name.toString()
        window.sf.routes[name] = d.route_id;
      } else if (city == "geneva") {
        var value = d.route_short_name + " -- " + d.route_long_name + " " + d.direction;
        routeSelect.append($("<option></option>").attr("value",d.route_short_name).text(value)); 
      } else { 
        var value = d.route_id + " -- " + d.route_long_name;
        routeSelect.append($("<option></option>").attr("value",d.route_short_name).text(value)); 
      }
    });
        
    /* Routes.csv is the geoJSON files */
    $.getJSON(path + city + '/routes/routes.json', function(data) {
              
      var myGoogleVector = new GeoJSON(data, googleOptions);
      window.paths = myGoogleVector;
          
      routeSelect.bind("change", function(){
        var route = $(this).val();

        showRoute(route);
            
      });
    });
  });
    
  // Populate the List of Stops
  var stopSelect = $("#stops");
      
  d3.csv(path + city + "/stops/stops.csv", function(data) {
    window.stops = data;
        
    stopSelect.empty().append("<option>Select a stop ...</option>");
        
    data.forEach(function(d, i){
      var value = d.stop_name + " -- " + d.stop_id;
      stopSelect.append($("<option></option>").attr("value", d.stop_id).text(value)); 
    });
  });
    
  stopSelect.bind("change", function(){
    var value = $(this).val();

    var stop = window.stops.filter(function(d) {
      return d.stop_id == value;
    });
              
    var coord = new google.maps.LatLng(stop[0].stop_lat, stop[0].stop_lon);
                
    map.addMarker(coord);
      
    $("#info .stop").html(stop[0].stop_name)
    google.maps.event.trigger(map, 'resize');
    map.setCenter(coord);
      
  });
      
}

function removeRoutes() {
  /* TODO: Fix this
   * Remove Routes w/o Paths */        
  routeSelect.find("option[value='10']").remove();
  routeSelect.find("option[value='8AX']").remove();
  routeSelect.find("option[value='BAX']").remove();
  routeSelect.find("option[value='28L']").remove();
  routeSelect.find("option[value='76']").remove();
  routeSelect.find("option[value='88']").remove();
}
    
function showRoute(route) {
  if (city == "sf") { var routeName = window.sf.abbr[0][route]; }

  
  map.clearMarkers();
  

  /* Check the Depth of the geoJSON 
     TODO: Move to reusable func.
     TODO: SANJU to Add his d3 geoJSON, which is colored by route. 
     TODO: Add or remove route based upon the route select box. 
  */
  var path = new Array();
  var length = 0;
            
	for (var i = 0; i < window.paths.length; i++){
            
    var color = colors[i % colors.length];

		if(window.paths[i].length){
                
			for(var j = 0; j < window.paths[i].length; j++){
        var line = window.paths[i][j].geojsonProperties.LINEABBR;
        $("#paths").append()
        
        //console.log(window.paths[0][0])
          
        if (city == "sf") {
          if (routeName[name] == line || routeName.indexOf(line) > -1) {
            window.paths[i][j].strokeColor = "#" + color;
            window.paths[i][j].strokeWeight = 1;
  					window.paths[i][j].setMap(map);
            length += google.maps.geometry.spherical.computeLength(window.paths[i][j].getPath()) / 1000;
          } else {
            window.paths[i][j].setMap(null);
          }
        } else if (city == "geneva") {
          window.paths[i][j].strokeColor = "#" + color;
          window.paths[i][j].strokeWeight = 1;
					window.paths[i][j].setMap(map);
          length += google.maps.geometry.spherical.computeLength(window.paths[i][j].getPath()) / 1000;
          
          if (window.paths[i][j].geojsonProperties.routeCode == route || window.paths[i][j].geojsonProperties.route_id == route) {
          
          } else {
            window.paths[i][j];
            window.paths[i][j].setMap(null);
          }
          
        }  
			}
		} else{
      //console.log(window.paths[i])
      //console.log(window.paths[i])
      window.paths[i].strokeColor = "#" + color;
			window.paths[i].setMap(map);
                
      //length = google.maps.geometry.spherical.computeLength(window.paths[i].getPath()) / 1000;
                
		}
	
  }
  $.getJSON('http://localhost:8080/urban-data-challenge/rest/stop-service/sf/' + window.sf.routes[route] + '/null/4015', function(data) {
 
    var first, last = null;
    
    $.each(data, function(key, val) {
      //  (key, val)
      if (key == "coordinates") {
        $.each(data.coordinates, function(key2, val2){
          /*
          val.split("\,");
          var lat = val[0];
          var lon = val[1];
          */
          //console.log(val2);
          var latLon = val2.split(",");
          
          var coord = new google.maps.LatLng(latLon[0], latLon[1]);
          
          if (key2 == 0) { first = coord; }
          if (key2 == data.length) { last = coord; }
          
          map.addMultipleMarkers(coord);
                
        });
      }
    });
    
    google.maps.event.trigger(map, 'resize');
    
    map.setCenter(first);
    map.setZoom(14);
    /* TODO: Check for inbound or outbound */
    var bounds = new google.maps.LatLngBounds(first, last);
    map.panToBounds(bounds)    
           
    
  });
  console.log(length)
}

/*
var arrivals;
    
d3.csv("sf-route-1-schedule-real.csv", function(data) {

  //console.log(routes)
  arrivals = data;
      
  // TODO: Update to match arrival and schedule column
  var formatNumber = d3.format(",d"),
      formatChange = d3.format("+,d"),
      formatDate = d3.time.format("%B %d, %Y"),
      formatTime = d3.time.format("%I:%M %p");
      
  arrivals.forEach(function(d, i) {
    d.index = i;
    console.log(d.date)
    //d.date = parseDate(d.date);
    //d.delay = +d.delay;
    //d.distance = +d.distance;
  });
                  
});
*/
