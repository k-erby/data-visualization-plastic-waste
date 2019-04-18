/* ------------- Start sidebar d3 visualization things ------------- */

	//Initialize radar chart variables
	var margin = {top: 35, right: 50, bottom: 30, left: 50},
	width = Math.min(270, window.innerWidth - 10) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	var color = d3.scale.ordinal()
				.range(["#ffe880", "#923334"]);//["#EDC951","#CC333F","#00A0B0"]);

	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 0.5,
	  levels: 5,
	  //labelFactor: 1.2,
	  roundStrokes: true,
	  color: color
	};

	var nice_labels = {"percent_inadequately_managed":"inadequately managed plastic", "percent_plastic_water":"plastic in water streams", "percent_plastic":"total plastic"};

	//note: plastic_waste_complete and averages are imported JSON
	var d3_country_json = JSON.parse(plastic_waste_complete);
	var d3_averages_json = JSON.parse(averages);
	var radar_averages = [];
	for (var key in d3_averages_json){
		if (d3_averages_json.hasOwnProperty(key)) {
			radar_averages.push({"axis": nice_labels[key], "value": d3_averages_json[key]/100});
		}
	}

	//Adds current country radar chart to sidebar
	var build_radar = function(country){
	var country_json = d3_country_json.filter(function(c){return c.country == country})[0];

		console.log(country_json);
		console.log(d3_averages_json);
		var radar_country = [];
		for (var key in country_json){
			if (country_json.hasOwnProperty(key) && (key == "percent_plastic_water" || key == "percent_inadequately_managed" || key == "percent_plastic")){
				radar_country.push({"axis": nice_labels[key], "value": country_json[key]/100});
			}
		}

		//show chart
		radarChart(".radarChart", [radar_averages,radar_country], radarChartOptions);
	};

	function remove_sidebar(title){
		//Remove RadarChart and exit button
		document.getElementsByTagName("svg")[0].remove();
		document.getElementById("exit_button").remove();

		//Return sidebar to original view
		if(title == displayName[0]){
			document.getElementById("percent_mismanaged_waste").click();
			console.log("case 1");
		} else if (title == displayName[1]){
			document.getElementById("switch_to_total_waste").click();
			console.log("case 2");
		} else {
			document.getElementById("switch_to_percent_waste").click();
			console.log("case 3");
		}

		//Un-hide nav buttons
		document.getElementById("percent_mismanaged_waste").style.visibility = "visible";
		document.getElementById("switch_to_total_waste").style.visibility = "visible";
		document.getElementById("switch_to_percent_waste").style.visibility = "visible";
	};

/* ------------- End sidebar d3 ------------- */

/* ----------------------------------------------------

Look at the geojson from mapbox and their us-states:
    https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson
    https://docs.mapbox.com/mapbox-gl-js/example/data-join/?fbclid=IwAR3TQvXuIK1m3uDvdME0Ram7-TXzbo5hzlyZ6sqINiy7MYBP6tDUR_1kO5E

---------------------------------------------------- */

var hoveredCountryId = null;

const displayIcon = {
  0: "img/banana.png",
  1: "img/trash.png",
  2: "img/person.png"
};

const displayName = {
    0: "Mismanaged Waste",
    1: "Total Waste",
    2: "Kg of Waste Per Person"
};

const dataDescriptions = {
    0: "Plastic waste that is inadequately disposed of as a percentage of the country's total waste generation."
        + "<br><br>This includes disposal in dumps or open, uncontrolled landfills, where it is not fully contained"
        + " and has a high risk of polluting rivers and oceans. This does not include 'littered'"
        + " plastic waste (approximately 2% of total waste).",
    1: "Total plastic waste generation by country, measured in tonnes per year, prior to waste management,"
		+ " recycling, or incineration.<br><br>High-income countries typically have well-managed"
        + " waste streams and therefore low levels of plastic pollution to external environments.",
    2: "Daily plastic waste generation per person, measured in kilograms per person per day.<br><br>This measures the"
        + " overall per capita plastic waste generation rate prior to waste management, recycling or incineration."
        + " It does not therefore directly indicate the risk of pollution to waterways or marine environments."
}

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
    var mapDataDescription = document.getElementById("map-data-description");
    var mapIcon = document.getElementById("map-icon");
    mapData.innerHTML = `${outputMapName()}`;
    mapDataDescription.innerHTML = `${outputDataDescription()}`;
    mapIcon.src = `${outputIcon()}`;

    /* ------------- Country Specific Actions ------------- */

	var popup = new mapboxgl.Popup()

	//Hover pop-up
    map.on('mouseenter', 'country-borders', function (e) {
		map.getCanvas().style.cursor = 'pointer';
        var country = e.features[0].properties.name;
        var value = e.features[0].properties.waste;

		popup.setLngLat(e.lngLat)
            .setHTML(`<h3>${country}</h3>${outputDataFormat(value)}`)
            .addTo(map);
    });

	//Click to modify sidebar
	map.on('click', 'country-borders', function (e) {
        var country = e.features[0].properties.name;
		console.log(country);

		build_radar(country);

		//Modify sidebar labels
		var mapData = document.getElementById("map-data-title");
		var mapDataDescription = document.getElementById("map-data-description");
		var oldTitle = mapData.textContent;
		mapData.innerHTML = `${country}`;
		mapDataDescription.innerHTML = `The radar chart shows how ${country} (red) differs from average plastic waste impact (yellow).<br>Percentages are in terms of total country waste.`;

		//Hide nav buttons
		document.getElementById("percent_mismanaged_waste").style.visibility = "hidden";
		document.getElementById("switch_to_total_waste").style.visibility = "hidden";
		document.getElementById("switch_to_percent_waste").style.visibility = "hidden";

		if (!document.contains(document.getElementById("exit_button"))) {
			//Add exit button
			var exit_button = document.createElement("button");
			exit_button.type = "button";
			exit_button.innerHTML = "Exit";
			exit_button.id = "exit_button";
			exit_button.className = "map-button";
			document.getElementsByClassName("map-button-list")[0].prepend(exit_button);
		}
		document.getElementById("exit_button").onclick = () => remove_sidebar(oldTitle);
    });

	//Clear hover pop-up
	map.on('mouseleave', 'country-borders', function() {
		map.getCanvas().style.cursor = '';
		popup.remove();
	});
}

function outputMapName() {
    switch(geoJson) {
        case stylesAndGeoJson.mismanaged_waste[1]:          { return displayName[0]; }
        case stylesAndGeoJson.total_waste[1]:               { return displayName[1]; }
        case stylesAndGeoJson.percentage_total_waste[1]:    { return displayName[2]; }
    }
}

function outputIcon() {
  switch (geoJson) {
    case stylesAndGeoJson.mismanaged_waste[1]: {
      return displayIcon[0];
    }
    case stylesAndGeoJson.total_waste[1]: {
      return displayIcon[1];
    }
    case stylesAndGeoJson.percentage_total_waste[1]: {
      return displayIcon[2];
    }
  }
}

function outputDataDescription() {
    switch(geoJson) {
        case stylesAndGeoJson.mismanaged_waste[1]:          { return dataDescriptions[0]; }
        case stylesAndGeoJson.total_waste[1]:               { return dataDescriptions[1]; }
        case stylesAndGeoJson.percentage_total_waste[1]:    { return dataDescriptions[2]; }
    }
}

function outputDataFormat(value) {
    switch (geoJson) {
        case stylesAndGeoJson.mismanaged_waste[1]: {
            return `${value === -1 ? "unknown" : value + "%"}`;
        }
        case stylesAndGeoJson.total_waste[1]: {
            return value == -1 ? value = "unknown" : value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " tonnes/year";
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

