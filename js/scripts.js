// sets up my mapbox access token so they can track my usage of their basemap services
mapboxgl.accessToken = 'pk.eyJ1Ijoia3dwMjI1IiwiYSI6ImNqdWQ5NjIydTB3bHMzeW9na3hybGpwZncifQ.z8p_gZgCZfgPdWIG-24ksQ';

// instantiate the map
var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-73.913269,40.687928],
  zoom: 10.5,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Load map and initialize layers
// Layers are initially hidden, and will change visual properties depending
// on what data source is selected for the map through the various buttons
map.on('style.load', function() {
  $('.legend').hide();
  $('.load-legend').show();

  // use map.getStyle() in the console to inspect the basemap layers
  map.setPaintProperty('water', 'fill-color', '#a4bee8')

  // sets up the geojson as a source in the map
  map.addSource('twitter-data', {
    type: 'geojson',
    data: './data/twitter-NY-final.geojson',
  });

  // initalize fill layer
  map.addLayer({
    id: 'tract-fill',
    type: 'fill',
    source: 'twitter-data',
    paint: {
      'fill-opacity': 0,
    }
  }, 'waterway-label')

  // add census tract lines layer
  map.addLayer({
    id: 'typology-line',
    type: 'line',
    source: 'twitter-data',
    paint: {
      'line-opacity': 0,
      'line-color': 'black',
      'line-opacity': {
        stops: [[12, 0], [14.8, 1]], // zoom-dependent opacity, the lines will fade in between zoom level 14 and 14.8
      }
    }
  }, 'waterway-label');

  // add an empty data source, which highlights the tract that a user clicks on
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted tract boundary
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 3,
      'line-opacity': 0,
      'line-color': 'red',
    }
  });

  // when the user clicks on the census tract map, do...
  map.on('click', function (e) {

    // selects the census tract features under the mouse
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['tract-fill'],
    });

    // get the first feature from the array of returned features.
    var tract = features[0]

    if (tract) {  // if there's a tract under the mouse, do...
    map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

    // lookup the corresponding description for the typology
    var typologyDescription = tract.properties["typology"];
    var ntaName = tract.properties["NTAName"];

    //add popup to display typology of selected tract and detailed data
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      `<div id="popup" class="popup" style="z-index: 10; color:${TypologyLookup(typologyDescription).color};">` +
      '<b> Neighborhood: </b>' + ntaName +" </br>" +
      '<b> Typology: </b>' + typologyDescription  + " </br>" +
      '<b> Total # of Tweets: </b>' + numeral(tract.properties["total_tweets"]).format('0,0') + " </br>" +
      '<b> # of Local Tweets: </b>' + numeral(tract.properties["local_tweets"]).format('0,0') + " (" +
      tract.properties["pct_local"] + "%)" + " </br>" +
      '<b> # of Visitor Tweets: </b>' + numeral(tract.properties["visitor_tweets"]).format('0,0') + " (" +
      tract.properties["pct_visitor"] + "%)" + " </br>" + '</div>'
    )
    .addTo(map);

    // set this tract's polygon feature as the data for the highlight source
    map.getSource('highlight-feature').setData(tract.geometry);
  } else {
    map.getCanvas().style.cursor = 'default'; // make the cursor default

    // reset the highlight source to an empty featurecollection
    map.getSource('highlight-feature').setData({
      type: 'FeatureCollection',
      features: []
    });
  }
});
});

//on button click, load map and legend for "All Tweets"
$('#buttonAll').on('click', function() {
  console.log('hello tweets')
  $('.legend').hide(); // hide all legend divs
  $('.alltweets-legend').show(); // only show the legend for the corresponding data

  // set visual properties according the data source corresponding to the button
  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'interval',
    property: "total_tweets",
    stops: [
      [allTweetStops[0], hexCodes[0]],
      [allTweetStops[1], hexCodes[1]],
      [allTweetStops[2], hexCodes[2]],
      [allTweetStops[3], hexCodes[3]],
      [allTweetStops[4], hexCodes[4]],
      [allTweetStops[5], hexCodes[5]],
      [allTweetStops[6], hexCodes[6]],
    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "red");

});

//on button click, load map and legend for "Local Tweets"
$('#buttonLocal').on('click', function() {
  console.log('hello locals')
  $('.legend').hide();
  $('.local-legend').show();

  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'interval',
    property: "pct_local",
    stops: [
      [localStops[0], hexCodes[0]],
      [localStops[1], hexCodes[1]],
      [localStops[2], hexCodes[2]],
      [localStops[3], hexCodes[3]],
      [localStops[4], hexCodes[4]],
      [localStops[5], hexCodes[5]],
      [localStops[6], hexCodes[6]],

    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "red");

});

//on button click, load map and legend for "Visitor Tweets"
$('#buttonVisitor').on('click', function() {
  console.log('hello visitors')
  $('.legend').hide();
  $('.visitor-legend').show();

  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'interval',
    property: "pct_visitor",
    stops: [
      [visitorStops[0], hexCodes[0]],
      [visitorStops[1], hexCodes[1]],
      [visitorStops[2], hexCodes[2]],
      [visitorStops[3], hexCodes[3]],
      [visitorStops[4], hexCodes[4]],
      [visitorStops[5], hexCodes[5]],
      [visitorStops[6], hexCodes[6]],
    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "red");

});

//on button click, load map and legend for "Gentrification Typologies"
$('#buttonTypology').on('click', function() {
  console.log('hello typologies')
  $('.legend').hide();
  $('.typology-legend').show();

  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'categorical',
    property: "typology",
    stops: [
      [
        typologies[0],
        TypologyLookup(typologies[0]).color,
      ],
      [
        typologies[1],
        TypologyLookup(typologies[1]).color,
      ],
      [
        typologies[2],
        TypologyLookup(typologies[2]).color,
      ],
      [
        typologies[3],
        TypologyLookup(typologies[3]).color,
      ],
      [
        typologies[4],
        TypologyLookup(typologies[4]).color,
      ],
      [
        typologies[5],
        TypologyLookup(typologies[5]).color,
      ],
      [
        typologies[6],
        TypologyLookup(typologies[6]).color,
      ],
      [
        typologies[7],
        TypologyLookup(typologies[7]).color,
      ],
      [
        typologies[8],
        TypologyLookup(typologies[8]).color,
      ],
      [
        typologies[9],
        TypologyLookup(typologies[9]).color,
      ],
    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "limegreen");


});
