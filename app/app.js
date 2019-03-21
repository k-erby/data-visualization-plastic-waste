/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson

    https://docs.mapbox.com/mapbox-gl-js/example/data-join/?fbclid=IwAR3TQvXuIK1m3uDvdME0Ram7-TXzbo5hzlyZ6sqINiy7MYBP6tDUR_1kO5E

---------------------------------------------------- */

mapboxgl.accessToken = 'pk.eyJ1IjoiY215a2VyYiIsImEiOiJjanQyNm5jZ28wbHJ1M3lvaHNoZ2pwOGd5In0.4AwOorclWiTE4FmzxkxJOw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cmykerb/cjsz9macbapfb1fls8vr9raxg',
    center: [20, 42],
    zoom: 1
});

var hoveredCountryId =  null;

// Adds the pathing around each country.
map.on('load', function () {
    map.addSource("countries", {
    "type": "geojson",
    "data": "countries.geojson"
});

map.addLayer({
    "id": "country-borders",
    "type": "fill",
    "source": "countries",
    "layout": {},
    "paint": {
        "fill-color": "#C7E5AF",
        "fill-opacity": 0.8
    }
});

map.addLayer({
    "id": "country-lines",
    "type": "line",
    "source": "countries",
    "layout": {},
    "paint": {
        "line-color": "#7e9e64",
        "line-opacity": 1
    }
});

// use this to dynamically change the colours of the countries
map.on("load", "country-filles", function(e) {

});

// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
map.on("mousemove", "country-fills", function(e) {
    console.log("TESTING");

    if (e.features.length > 0) {
        if (hoveredCountryId) {
            map.setFeatureCountry({source: 'countries', id: hoveredCountryId}, { hover: false});
        }
    hoveredCountryId = e.features[0].id;
    map.setFeatureCountry({source: 'countries', id: hoveredCountryId}, { hover: true});
    }
});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
map.on("mouseleave", "country-fills", function() {
    if (hoveredCountryId) {
        map.setFeatureCountry({source: 'countries', id: hoveredCountryId}, { hover: false});
    }
    hoveredCountryId =  null;
    });
});

map.on('click', 'country-borders', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var country = e.features[0].properties.name;

    console.log("TEST");
    console.log(country);

});


