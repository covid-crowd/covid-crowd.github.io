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

  add_state_info = function(d,counties_in_state,state)  {

    //`<p><b class="status-2">We have complete data from these ${} counties: ${county_names}`
    
    counties_with_intervention_data = counties_in_state.filter(function(item) {
        return item.intervention_data != undefined;
    })

    console.log(counties_with_intervention_data)

    county_names = counties_with_intervention_data.map(function (item) {
        return `<a onclick="add_county_info(${item.id})">${item.properties.name}</a>`
    }).join(", ")

    var partial_counties, no_data_counties;
    num_partial_counties = counties_with_intervention_data.length;

    if (num_partial_counties == 0)
    {
      partial_counties = '';
    } 
    else if (num_partial_counties == 1) {
      partial_counties = `<p><b class="status-1">We have partial data from one ` + 
            `county, but need more info from residents! </b> `+
            `${county_names}</p>`  
    }
    else {
        partial_counties = `<p><b class="status-1">We have partial data from these ` + 
            `${num_partial_counties} counties, but need more info from residents! </b>`+
            `${county_names}</p>`  
    }

    num_no_data_counties = counties_in_state.length - num_partial_counties

    if (num_no_data_counties == 0)
    {
      no_data_counties = '';
    } 
    else if (num_no_data_counties == 1) {
      no_data_counties = `<p><b class="status-1">We need data from one` + 
            `more county in this state, anyone can volunteer!</b>`
    }
    else {
        no_data_counties = `<p><b class="status-0">We need data from ${num_no_data_counties}`+` 
        more counties in this state, anyone can volunteer!</b></p>`
    }

    var div_content = `<h4> ${state} </h4>                
                      ${partial_counties}  
                      ${no_data_counties}
                      `
    document.getElementById("state-info").innerHTML = div_content;
  }

  add_county_info = function(argument) {
    var div_content = `<h4> </h4>`
    document.getElementById("county-info").innerHTML = div_content;
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

   d3.select("svg").append("g")
  .selectAll("path")
  .data(counties)
  .join("path")      
    .attr("fill", d => color(d.data.status))
    .attr("opacity", 0.8)
    .attr("d", path)

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
      add_state_info(d,counties_in_state,d.properties.name)
    });

  const outline = svg.append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", "3")
  .attr("stroke-linejoin", "round")
  .attr("pointer-events", "none");

  california = states.find(d => d.id == "06");
  california_counties = counties.filter(function (item) { return "06" === item.id.slice(0,2); });
  outline.attr("d",path(california));
  add_state_info(california,california_counties,"California");

  d3.select("#santa-clara-link").on("click", () => {d3.select("#santa-clara-info").attr("style","display:block;")})

 

}

var promises = [];

promises.push(d3.csv('d3-data/county_data.csv'))
promises.push(d3.json('d3-data/counties-albers-10m.json'))
promises.push(d3.csv('d3-data/intervention_data.csv'))

Promise.all(promises).then(function(values) {
    drawGraph(values)
});