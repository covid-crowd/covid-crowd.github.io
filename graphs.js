// global variables used across all charts
var padding = 20;
var width = 975;
var height = 610;

function drawGraph(values) {    
  var path = d3.geoPath();
  const color = function (x) {
    if (x == 0){ return "none"; }
    if (x == 1){ return "#eaab00"; }
    if (x == 2){ return "#175e54"; }
  }

  add_state_info = function()  {
      return;
  }

  add_county_info = function(argument) {
    return;
  }


  var county_data = values[0];
  var us = values[1];
  var intervention_data = values[2];

  var states = topojson.feature(us, us.objects.states).features;
  var counties = topojson.feature(us, us.objects.counties).features;

  // add the data from county_data and intervention_data
  // into the data array that we get from topojson
  counties.forEach(function (item) {
      item.data = county_data.find(function (d) { return d.id === item.id; })
      item.intervention_data = undefined;
  });

  
  intervention_data.forEach(function (item) {
      county = counties.find(function (d) { return d.id === item.fips })
      county.intervention_data = item;
  });

  // code from Bostock's d3 documentation on Observable  
  // URL: 

  svg_string = `<svg viewBox="0 0 ${width} ${height}">
<g fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">
  <path stroke="#aaa" stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)))}"></path>
  <path stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))}"></path>
  <path d="${path(topojson.feature(us, us.objects.nation))}"></path>
</g>
</svg>`
  
  var svg = d3.select("#mapcontainer");  
  svg.html(svg_string);
  svg = d3.select("svg");

  // code to select a state and outline it in green 
  svg.append("g")
  .attr("opacity", "0")
  .selectAll("path")
  .data(states)
  .enter().append("path")
    .attr("d", path)
    .on("click", d => {
      outline.attr("d", path(d));
      counties_in_state = counties.filter(function (item) { return d.id === item.id.slice(0,2); });
      add_state_info(d,counties_in_state)
    });

  const outline = svg.append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", "3")
  .attr("stroke-linejoin", "round")
  .attr("pointer-events", "none");

  outline.attr("d",path(states.find(d => d.id == "06")));

  d3.select("#santa-clara-link").on("click", () => {d3.select("#santa-clara-info").attr("style","display:block;")})

  d3.select("svg").append("g")
  .selectAll("path")
  .data(counties)
  .join("path")      
    .attr("fill", d => color(d.data.status))
    .attr("d", path)

}

var promises = [];

promises.push(d3.csv('d3-data/county_data.csv'))
promises.push(d3.json('d3-data/counties-albers-10m.json'))
promises.push(d3.csv('d3-data/intervention_data.csv'))

Promise.all(promises).then(function(values) {
    drawGraph(values)
});