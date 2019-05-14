// sets up my mapbox access token so they can track my usage of their basemap services
mapboxgl.accessToken = 'pk.eyJ1Ijoia3dwMjI1IiwiYSI6ImNqdWQ5NjIydTB3bHMzeW9na3hybGpwZncifQ.z8p_gZgCZfgPdWIG-24ksQ';

// instantiate the map
var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-73.850784,40.716298],
  zoom: 10.5,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//load map and initialize hidden layers
map.on('style.load', function() {
  $('.legend').hide();
  $('.load-legend').show();
  // you can use map.getStyle() in the console to inspect the basemap layers
  map.setPaintProperty('water', 'fill-color', '#a4bee8')

  // this sets up the geojson as a source in the map, which I can use to add visual layers
  map.addSource('twitter-data', {
    type: 'geojson',
    data: './data/twitter-NY-final.geojson',
  });

  // add a layer for choropleth-style fills
  map.addLayer({
    id: 'tract-fill',
    type: 'fill',
    source: 'twitter-data',
    paint: {
      'fill-opacity': 0,
    }
  }, 'waterway-label')

  // add an outline to the tax lots which is only visible after zoom level 14.8
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

  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted lot
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 3,
      'line-opacity': 0,
      'line-color': 'purple',
    }
  });

  // when the mouse clicks, do stuff
  map.on('click', function (e) {

    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['tract-fill'],
    });

    // get the first feature from the array of returned features.
    var lot = features[0]
        console.log(lot);
    // console.log(lot)
    // console.log(e)
    if (lot) {  // if there's a lot under the mouse, do stuff
      map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

      // lookup the corresponding description for the typology
      var typologyDescription = lot.properties["typology"];
      var ntaName = lot.properties["NTAName"];

      // use jquery to display the geoid and typology the sidebar
      $('#address').text("GEOID: " + lot.properties.geoid);
      $('#landuse').text(typologyDescription);

      //add popup to display typology of selected tract
      new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(

      '<div id="popup" class="popup" style="z-index: 10;">' +
      '<b> Neighborhood: </b>' + ntaName +" </br>" +
      '<b> Typology: </b>' + typologyDescription + " </br>" +
      '<b> Total # of Tweets: </b>' + numeral(lot.properties["total_tweets"]).format('0,0') + " </br>" +
      '<b> # of Local Tweets: </b>' + numeral(lot.properties["local_tweets"]).format('0,0') + " (" +
      lot.properties["pct_local"] + "%)" + " </br>" +
      '<b> # of Visitor Tweets: </b>' + numeral(lot.properties["visitor_tweets"]).format('0,0') + " (" +
      lot.properties["pct_visitor"] + "%)" + " </br>" +
        // '<ul class="list-group">' +
        // '<img src="url-address/" >' + feature2.properties['Image'] +
        // '<li class="list-group-item"> <b> Neighborhood </b>' + ntaName +" </li>" +
        // '<li class="list-group-item"> Typology: ' + typologyDescription + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures'] + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures2'] + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures3'] + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures4'] + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures5'] + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures6'] + " </li>" +
        // '<li class="list-group-item">' + feature2.properties['Fixtures7'] + " </li>" +
        // '</ul>
        '</div>'
        )
      .addTo(map);

      // set this lot's polygon feature as the data for the highlight source
      map.getSource('highlight-feature').setData(lot.geometry);
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

//on button, load map and legend
$('#buttonAll').on('click', function() {
  console.log('hello tweets')
  $('.legend').hide();
  $('.alltweets-legend').show();

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
  map.setPaintProperty('highlight-line', 'line-color', "lavender");

});


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
  map.setPaintProperty('highlight-line', 'line-color', "lavender");

});


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
  map.setPaintProperty('highlight-line', 'line-color', "lavender");

});

$('#buttonTypology').on('click', function() {
  console.log('hello typologies')
  $('.legend').hide();
  $('.typology-legend').show();
  // add a custom-styled layer for tax lots
  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
        type: 'categorical',
        property: "typology",
        stops: [
            [
              "LI - Not Losing Low-Income Households",
              TypologyLookup(1).color,
            ],
            [
              "LI - Ongoing Displacement of Low-Income Households",
              TypologyLookup(2).color,
            ],
            [
              "LI - At Risk of Gentrification",
              TypologyLookup(3).color,
            ],
            [
              "LI - Ongoing Gentrification",
              TypologyLookup(4).color,
            ],
            [
              "MHI - Advanced Gentrification",
              TypologyLookup(5).color,
            ],
            [
              "MHI - Stable or Early Stage of Exclusion",
              TypologyLookup(6).color,
            ],
            [
              "MHI - Ongoing Exclusion",
              TypologyLookup(7).color,
            ],
            [
              "MHI - Advanced Exclusion",
              TypologyLookup(8).color,
            ],
            [
              "VHI - Super Gentrification or Exclusion",
              TypologyLookup(9).color,
            ],
            [
              "Missing Data",
              TypologyLookup(10).color,
            ],
          ]
        });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "yellow");



});
