
/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson
    https://docs.mapbox.com/mapbox-gl-js/example/data-join/?fbclid=IwAR3TQvXuIK1m3uDvdME0Ram7-TXzbo5hzlyZ6sqINiy7MYBP6tDUR_1kO5E

---------------------------------------------------- */

var hoveredCountryId = null;
var maxValue = 13;

// they hardcoded a json in here. idk why though
var data = null;

/* ------------- MapBox API ------------- */
mapboxgl.accessToken = 'pk.eyJ1IjoiY215a2VyYiIsImEiOiJjanQyNm5jZ28wbHJ1M3lvaHNoZ2pwOGd5In0.4AwOorclWiTE4FmzxkxJOw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cmykerb/cjsz9macbapfb1fls8vr9raxg',
    center: [20, 42],
    zoom: 1
});
map.addControl(new mapboxgl.NavigationControl());

/* ------------- Loading Map Boundaries ------------- */
map.on('load', function () {
    map.addSource("countries", {
        "type": "geojson",
        "data": "countries.geojson"
    });


//
//    var expression = ["match", ["get", "waste"]];
//
//    data.forEach(function(row) {
//        var green = (row["waste"] / maxValue) * 255;
//        var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
//        expression.push(row["waste"], color);
//    });
//
//    // Last value is the default, used where there is no data
//    expression.push("rgba(0,0,0,0)");

    map.addLayer({
        "id": "country-borders",
        "type": "fill",
        "source": "countries",
        'paint': {
            "fill-color": "#C7E5AF",
            "fill-opacity": 0.5
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


    /* ------------- Choropleth ------------- */
    // use this to dynamically change the colours of the countries
    map.on("load", "country-fills", function(e) {

    });
});


/* ------------- Hovering on Countries ------------- */
map.on("mouseenter", "country-borders", function(e) {
    map.getCanvas().style.cursor = 'pointer';
    hoveredCountryId = e.features[0].properties.name;
    console.log("ENTER: This is the hovered country: " + hoveredCountryId)

    if (e.features.length > 0) {
        if (hoveredCountryId) {
            //map.setFeatureState({source: 'countries', id: hoveredCountryId}, { hover: false});
        }
        //map.setFeatureState({source: 'countries', id: hoveredCountryId}, { hover: true});
    }
});

map.on("mouseleave", "country-borders", function(e) {
    map.getCanvas().style.cursor = '';
    console.log("LEAVE: This is the unhovered country: " + hoveredCountryId)

    if (hoveredCountryId) {
        //map.setFeatureState({source: 'countries', id: hoveredCountryId}, { hover: false});
    }
    hoveredCountryId =  null;
});


/* ------------- Clicking Country ------------- */
map.on('click', 'country-borders', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var country = e.features[0].properties.name;

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.name)
        .addTo(map);

    console.log("CLICK: This is the clicked country: " + hoveredCountryId)
});


