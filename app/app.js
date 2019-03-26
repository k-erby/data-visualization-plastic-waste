
/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson
    https://docs.mapbox.com/mapbox-gl-js/example/data-join/?fbclid=IwAR3TQvXuIK1m3uDvdME0Ram7-TXzbo5hzlyZ6sqINiy7MYBP6tDUR_1kO5E

---------------------------------------------------- */

var hoveredCountryId = null;

const displayName = {
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

var colors = ['#3e6982', '#709397', '#92b0a4', '#c8d6b8', '#fff4c1', '#e3ba8e', '#b77157', '#b4624d', '#923334'];
var geoJson = stylesAndGeoJson.percentage_total_waste[1];


/* ------------- MapBox API ------------- */
mapboxgl.accessToken = 'pk.eyJ1IjoiY215a2VyYiIsImEiOiJjanQyNm5jZ28wbHJ1M3lvaHNoZ2pwOGd5In0.4AwOorclWiTE4FmzxkxJOw';

// set the default map view
var map = new mapboxgl.Map({
    container: 'map',
    style: stylesAndGeoJson.percentage_total_waste[0],
    center: [22, 42],
    zoom: 1
});

refreshMap();
displayLegend();


/* --------- Buttons to switch map view ------- */
document.getElementById("switch_to_total_waste").onclick = () => {
    map = new mapboxgl.Map({
        container: 'map',
        style: stylesAndGeoJson.total_waste[0],
        center: [22, 42],
        zoom: 1
    });
    geoJson = stylesAndGeoJson.total_waste[1];

    refreshMap();
};

document.getElementById("switch_to_percent_waste").onclick = () => {
    map = new mapboxgl.Map({
        container: 'map',
        style: stylesAndGeoJson.percentage_total_waste[0],
        center: [22, 42],
        zoom: 1
    });
    geoJson = stylesAndGeoJson.percentage_total_waste[1];

    refreshMap();
};

document.getElementById("percent_mismanaged_waste").onclick = () => {
    map = new mapboxgl.Map({
        container: 'map',
        style: stylesAndGeoJson.mismanaged_waste[0],
        center: [22, 42],
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
            "paint": { "fill-opacity": 0 }
        });

        map.addLayer({
            "id": "country-lines",
            "type": "line",
            "source": "countries",
            "layout": {},
            "paint": {
                "line-color": "#709397",
                "line-opacity": 1
            }
        });
    });

    // update the map info
    var mapData = document.getElementById("map-data-title");
    mapData.innerHTML = `${outputMapName()}`;


    /* ------------- Clicking Country ------------- */
    map.on('click', 'country-borders', function (e) {
        var country = e.features[0].properties.name;
        var value = e.features[0].properties.waste;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>${country}</h3>${outputDataFormat(value)}`)
            .addTo(map);
    });
}

function outputMapName() {
    switch(geoJson) {
        case stylesAndGeoJson.mismanaged_waste[1]:          { return displayName[0]; }
        case stylesAndGeoJson.total_waste[1]:               { return displayName[1]; }
        case stylesAndGeoJson.percentage_total_waste[1]:    { return displayName[2]; }
    }
}

function outputDataFormat(value) {
    switch (geoJson) {
        case stylesAndGeoJson.mismanaged_waste[1]: {
            return `${value === -1 ? "unknown" : value + "%"}`;
        }
        case stylesAndGeoJson.total_waste[1]: {
            return `${value === -1 ? "unknown" : value + " tonnes/year"}`;
        }
        case stylesAndGeoJson.percentage_total_waste[1]: {
            return `${value === -1 ? "unknown" : value + " kg/person"}`;
        }
        default: { return ""; }
    }
}

function displayLegend() {
    var legendKeyBox = document.createElement("div");
    legendKeyBox.className = "legendKeyBox";

    for (i = 0; i < colors.length; i++) {
      var color = colors[i];
      var key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      legendKeyBox.appendChild(key);
      legend.appendChild(legendKeyBox);
    }

    var legendText = document.createElement("div");
    legendText.className = "legendTextBox"

    var legendLess = document.createElement("span");
    legendLess.innerHTML = "less waste";
    legendText.appendChild(legendLess);

    var legendMore = document.createElement("span");
    legendMore.innerHTML = "more waste";
    legendText.appendChild(legendMore);

    legend.appendChild(legendText);
}


