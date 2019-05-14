var hexCodes = ['#440154', '#443a83', '#31688e', '#20908d', '#35b779', '#8fd744', '#fde725'];

var allTweetStops = [350, 9000, 18500, 32000, 51500, 81500, 133000, 236501];

var localStops = [0, 15, 30, 45, 60, 72, 85, 101];

var visitorStops = [0, 15, 30, 45, 60, 72, 85, 101];

var typologies = ['LI - Not Losing Low-Income Households', 'LI - Ongoing Displacement of Low-Income Households',
                  'LI - At Risk of Gentrification', 'LI - Ongoing Gentrification', 'MHI - Advanced Gentrification',
                  'MHI - Stable or Early Stage of Exclusion', 'MHI - Ongoing Exclusion', 'MHI - Advanced Exclusion',
                  'VHI - Super Gentrification or Exclusion', 'Missing Data']

// a helper function for looking up colors and descriptions for typologies
var TypologyLookup = (code) => {
  switch (code) {
    case typologies[0]:
      return {
        color: '#3f49ff',
        description: 'Not Losing Low-Income Households',
      };
    case typologies[1]:
      return {
        color: '#653df4',
        description: 'Ongoing Displacement of LI Households',
      };
    case typologies[2]:
      return {
        color: '#8a62ee',
        description: 'At Risk of Gentrification',
      };
    case typologies[3]:
      return {
        color: '#9b87de',
        description: 'Ongoing Gentrification',
      };
    case typologies[4]:
      return {
        color: '#f8b1a0',
        description: 'Advanced Gentrification',
      };
    case typologies[5]:
      return {
        color: '#ffa474',
        description: 'Stable or Early Stage of Exclusion',
      };
    case typologies[6]:
      return {
        color: '#e75758',
        description: 'Ongoing Exclusion',
      };
    case typologies[7]:
      return {
        color: '#c0223b',
        description: 'Advanced Exclusion',
      };
    case typologies[8]:
      return {
        color: '#8b0000',
        description: 'Super Gentrification or Exclusion',
      };
    default:
      return {
        color: '#c9c9c9',
        description: 'Missing Data',
      };
  }
};


// for (var i=1; i<11; i++) {
//   // lookup the typology info for the current iteration
//   const TypologyInfo = TypologyLookup(i);
//
//   // this is a simple jQuery template, it will append a div to the legend with the color and description
//   $('.typology-legend').append(`
//     <div>
//       <div class="legend-color-box" style="background-color:${TypologyInfo.color};"></div>
//       <span> ${TypologyInfo.description} </span>
//     </div>
//   `)
// }

$('.typology-legend').append(`<h6>Lower Income (LI) Tracts</h6>`)
for (var i=0; i<4; i++) {
  // lookup the typology info for the current iteration
  const TypologyInfo = TypologyLookup(typologies[i]);
  $('.typology-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${TypologyInfo.color};"></div>
      <span> ${TypologyInfo.description} </span>
    </div>
  `)
}
// $('.typology-legend').append(`<span> </span>`)
$('.typology-legend').append(`<h6>Moderate To High Income (MHI) or Very High Income (VHI) Tracts</h6>`)
for (var i=4; i<9; i++) {
  // lookup the typology info for the current iteration
  const TypologyInfo = TypologyLookup(typologies[i]);
  $('.typology-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${TypologyInfo.color};"></div>
      <span> ${TypologyInfo.description} <span>
    </div>
  `)
}

$('.typology-legend').append(`<h6>Missing Data/Unclassified</h6>`)
for (var i=9; i<10; i++) {
  // lookup the typology info for the current iteration
  const TypologyInfo = TypologyLookup(typologies[i]);
  $('.typology-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${TypologyInfo.color};"></div>
      <span> ${TypologyInfo.description} </span>
    </div>
  `)
}

for (var i=0; i<7; i++) {

  // this is a simple jQuery template, it will append a div to the legend with the color and description
  $('.alltweets-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${hexCodes[i]};"></div>
      <span> ${allTweetStops[i]} - ${allTweetStops[i+1]-1} tweets </span>
    </div>
  `)

  $('.local-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${hexCodes[i]};"></div>
      <span> ${localStops[i]}% - ${localStops[i+1]-1}% </span>
    </div>
  `)

  $('.visitor-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${hexCodes[i]};"></div>
      <span> ${visitorStops[i]}% - ${visitorStops[i+1]-1}% </span>
    </div>
  `)
}
