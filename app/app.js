
/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson
    https://docs.mapbox.com/mapbox-gl-js/example/data-join/?fbclid=IwAR3TQvXuIK1m3uDvdME0Ram7-TXzbo5hzlyZ6sqINiy7MYBP6tDUR_1kO5E

---------------------------------------------------- */

var hoveredCountryId = null;

// they hardcoded a json in here. idk why though
const styles = {
    mismanaged_waste: "mapbox://styles/cmykerb/cjtnfon9y2th11fph12fe3k9j",
    total_waste: "mapbox://styles/cmykerb/cjtnghjlm24kv1fmrutxx082z",
    percentage_total_waste: "mapbox://styles/cmykerb/cjtkowpvw19ji1fs2549azkn9"
};

/* ------------- MapBox API ------------- */
mapboxgl.accessToken = 'pk.eyJ1IjoiY215a2VyYiIsImEiOiJjanQyNm5jZ28wbHJ1M3lvaHNoZ2pwOGd5In0.4AwOorclWiTE4FmzxkxJOw';
// set the default map view
var map = new mapboxgl.Map({
    container: 'map',
    style: styles.percentage_total_waste,
    center: [20, 42],
    zoom: 1
});
map.addControl(new mapboxgl.NavigationControl());

refreshMap();

/* --------- Buttons to switch map view ------- */
document.getElementById("switch_to_total_waste").onclick = function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: styles.total_waste,
        center: [20, 42],
        zoom: 1
    });
    refreshMap();
};


document.getElementById("switch_to_percent_waste").onclick = function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: styles.percentage_total_waste,
        center: [20, 42],
        zoom: 1
    });
    refreshMap();
};

document.getElementById("percent_mismanaged_waste").onclick = function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: styles.mismanaged_waste,
        center: [20, 42],
        zoom: 1
    });
    refreshMap();
};


function refreshMap () {
    map.on('load', function () {
        map.addSource("countries", {
            "type": "geojson",
            "data": "../json/countries.geojson"
        });

        map.addLayer({
            "id": "country-borders",
            "type": "fill",
            "source": "countries",
            'paint': {
                "fill-color": "#C7E5AF",
                "fill-opacity": 0
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
    });


    /* ------------- Hovering on Countries ------------- */
    map.on("mouseenter", "country-borders", function (e) {
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

    map.on("mouseleave", "country-borders", function (e) {
        map.getCanvas().style.cursor = '';
        console.log("LEAVE: This is the unhovered country: " + hoveredCountryId)

        if (hoveredCountryId) {
            //map.setFeatureState({source: 'countries', id: hoveredCountryId}, { hover: false});
        }
        hoveredCountryId = null;
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
}


