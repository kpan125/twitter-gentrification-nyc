var hexCodes = ['#440154', '#443a83', '#31688e', '#20908d', '#35b779', '#8fd744', '#fde725'];

var allTweetStops = [350, 9000, 18500, 32000, 51500, 81500, 133000, 236501];

var localStops = [0, 15, 30, 45, 60, 72, 85, 101];

var visitorStops = [0, 15, 30, 45, 60, 72, 85, 101];
// a helper function for looking up colors and descriptions for typologies
var TypologyLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#0000ff',
        description: 'LI - Not Losing Low-Income Households',
      };
    case 2:
      return {
        color: '#653df4',
        description: 'LI - Ongoing Displacement of Low-Income Households',
      };
    case 3:
      return {
        color: '#8a62ee',
        description: 'LI - At Risk of Gentrification',
      };
    case 4:
      return {
        color: '#9b87de',
        description: 'LI - Ongoing Gentrification',
      };
    case 5:
      return {
        color: '#f7cabf',
        description: 'MHI - Advanced Gentrification',
      };
    case 6:
      return {
        color: '#ffa474',
        description: 'MHI - Stable or Early Stage of Exclusion',
      };
    case 7:
      return {
        color: '#e75758',
        description: 'MHI - Ongoing Exclusion',
      };
    case 8:
      return {
        color: '#c0223b',
        description: 'MHI - Advanced Exclusion',
      };
    case 9:
      return {
        color: '#8b0000',
        description: 'VHI - Super Gentrification or Exclusion',
      };
    default:
      return {
        color: '#bab8b6',
        description: 'Missing Data',
      };
  }
};

// for (var i=1; i<5; i++) {
//   // lookup the typology info for the current iteration
//   const TypologyInfo = TypologyLookup(i);
//
//   // this is a simple jQuery template, it will append a div to the legend with the color and description
//   $('.alltweets-legend').append(`
//     <div>
//       <div class="legend-color-box" style="background-color:${TypologyInfo.color};"></div>
//       ${TypologyInfo.description}
//     </div>
//   `)
// }



for (var i=1; i<11; i++) {
  // lookup the typology info for the current iteration
  const TypologyInfo = TypologyLookup(i);

  // this is a simple jQuery template, it will append a div to the legend with the color and description
  $('.typology-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${TypologyInfo.color};"></div>
      ${TypologyInfo.description}
    </div>
  `)
}

for (var i=0; i<7; i++) {

  // this is a simple jQuery template, it will append a div to the legend with the color and description
  $('.alltweets-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${hexCodes[i]};"></div>
      ${allTweetStops[i]} - ${allTweetStops[i+1]-1} tweets
    </div>
  `)

  $('.local-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${hexCodes[i]};"></div>
      ${localStops[i]}% - ${localStops[i+1]-1}%
    </div>
  `)

  $('.visitor-legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${hexCodes[i]};"></div>
      ${visitorStops[i]}% - ${visitorStops[i+1]-1}%
    </div>
  `)
}
