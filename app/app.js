
/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson
    https://docs.mapbox.com/mapbox-gl-js/example/data-join/?fbclid=IwAR3TQvXuIK1m3uDvdME0Ram7-TXzbo5hzlyZ6sqINiy7MYBP6tDUR_1kO5E

---------------------------------------------------- */

var hoveredCountryId = null;

const displayName ={
    0: "Mismanaged Waste",
    1: "Total Waste",
    2: "Kg of Waste Per Person"
};

const stylesAndGeoJson = {
    mismanaged_waste: ["mapbox://styles/cmykerb/cjtnfon9y2th11fph12fe3k9j",
                        "countries-mismanaged-waste-total.geojson"],
    total_waste: ["mapbox://styles/cmykerb/cjtnghjlm24kv1fmrutxx082z",
                    "countries-plastic-waste-total.geojson"],
    percentage_total_waste: ["mapbox://styles/cmykerb/cjtkowpvw19ji1fs2549azkn9",
                                "countries-waste.geojson"]
};

var geoJson = stylesAndGeoJson.percentage_total_waste[1];


/* ------------- MapBox API ------------- */
mapboxgl.accessToken = 'pk.eyJ1IjoiY215a2VyYiIsImEiOiJjanQyNm5jZ28wbHJ1M3lvaHNoZ2pwOGd5In0.4AwOorclWiTE4FmzxkxJOw';
// set the default map view
var map = new mapboxgl.Map({
    container: 'map',
    style: stylesAndGeoJson.percentage_total_waste[0],
    center: [20, 42],
    zoom: 1
});
map.addControl(new mapboxgl.NavigationControl());

refreshMap();

/* --------- Buttons to switch map view ------- */
document.getElementById("switch_to_total_waste").onclick = function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: stylesAndGeoJson.total_waste[0],
        center: [20, 42],
        zoom: 1
    });
    geoJson = stylesAndGeoJson.total_waste[1];

    refreshMap();
};


document.getElementById("switch_to_percent_waste").onclick = function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: stylesAndGeoJson.percentage_total_waste[0],
        center: [20, 42],
        zoom: 1
    });
    geoJson = stylesAndGeoJson.percentage_total_waste[1];

    refreshMap();
};

document.getElementById("percent_mismanaged_waste").onclick = function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: stylesAndGeoJson.mismanaged_waste[0],
        center: [20, 42],
        zoom: 1
    });
    geoJson = stylesAndGeoJson.mismanaged_waste[1];

    refreshMap();
};


function refreshMap () {
    map.on('load', function () {
        map.addSource("countries", {
            "type": "geojson",
            "data": "../json/" + geoJson
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

    // update the map info
    var mapData = document.getElementById("map-data");
    mapData.innerHTML = `<h2>${outputMapName()}</h2>`;


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
        var country = e.features[0].properties.name;
        var value = e.features[0].properties.waste;


        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>${country}</h3>${outputDataFormat(value)}`)
            .addTo(map);

        console.log("CLICK: This is the clicked country: " + e.features[0].properties.waste)
    });
}

function outputMapName() {

    if (geoJson === stylesAndGeoJson.mismanaged_waste[1]) {
        return displayName[0];
    }
    else if (geoJson === stylesAndGeoJson.total_waste[1]) {
        return displayName[1];
    }
    else if (geoJson === stylesAndGeoJson.percentage_total_waste[1]) {
        return displayName[2];
    }
}

function outputDataFormat(value) {

    if (geoJson === stylesAndGeoJson.mismanaged_waste[1]) {
        return `${value === -1 ? "unknown" : value + "%"}`;

    }
    else if (geoJson === stylesAndGeoJson.total_waste[1]) {
        return `${value === -1 ? "unknown" : value + " tonnes/year"}`;
    }

    else if (geoJson === stylesAndGeoJson.percentage_total_waste[1]) {
        return `${value === -1 ? "unknown" : value + " kg/person"}`;
    }
    return "";
}


