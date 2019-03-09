/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson

---------------------------------------------------- */


var hoveredStateId =  null;

// Adds the pathing around each country.
map.on('load', function () {
    map.addSource("countries", {
    "type": "geojson",
    "data": "countries.geojson"
});

// Adds the paths between the countries.
map.addLayer({
    "id": "country-borders",
    "type": "line",
    "source": "countries",
    "layout": {},
    "paint": {
    "line-color": "#7e9e64",
    "line-width": 1
    }
});

/*
This is all from the mapbox point-and-click guy.

// The feature-state dependent fill-opacity expression will render the hover effect
// when a feature's hover state is set to true.
map.addLayer({
    "id": "state-fills",
    "type": "fill",
    "source": "states",
    "layout": {},
    "paint": {
    "fill-color": "#627BC1",
    "fill-opacity": ["case",
    ["boolean", ["feature-state", "hover"], false],
        1,
        0.5
        ]
    }
});





// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
map.on("mousemove", "country-fills", function(e) {
    if (e.features.length > 0) {
        if (hoveredStateId) {
            map.setFeatureState({source: 'countries', id: hoveredStateId}, { hover: false});
    }
    hoveredStateId = e.features[0].id;
    map.setFeatureState({source: 'countries', id: hoveredStateId}, { hover: true});
    }
});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
map.on("mouseleave", "country-fills", function() {
    if (hoveredStateId) {
        map.setFeatureState({source: 'countries', id: hoveredStateId}, { hover: false});
    }
    hoveredStateId =  null;
    });
});
*/