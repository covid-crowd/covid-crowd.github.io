  // global variables used across all charts
  var padding = 20;
  var width = Math.min(900,document.getElementsByClassName("container")[0].offsetWidth - 10);
  var height = 300;

  function drawGraph(values) {    
    var path = d3.geoPath()
    var svg = d3.select("#mapcontainer")
    const color = function (x) {
      if (x == 0){ return "none"; }
      if (x == 1){ return "#eaab00"; }
      if (x == 2){ return "#175e54"; }
    }

    var data = values[0]
    var us = values[1]

    // code from Bostock's d3 documentation on Observable  
    // URL: 

    svg_string = `<svg viewBox="0 0 ${width} 610">
  <g fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">
    <path stroke="#aaa" stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)))}"></path>
    <path stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))}"></path>
    <path d="${path(topojson.feature(us, us.objects.nation))}"></path>
  </g>
</svg>`
  
    svg.html(svg_string)

    svg = d3.select("svg")


    counties = topojson.feature(us, us.objects.counties).features

    counties.forEach(function (item) {
        item.data = data.find(function (d) { return d.id === item.id })
    })


    // code to select a state and outline it in green 
    svg.append("g")
    .attr("opacity", "0")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .on("click", d => {
        outline.attr("d", path(d));
        console.log(d.id)
        if (d.id == "36") {
          d3.select("#california-info").attr("style","display:none;")
          d3.select("#new-york-info").attr("style","display:block;")
          d3.select("#santa-clara-info").attr("style","display:none;")
        }
        if (d.id == "06") {
          d3.select("#california-info").attr("style","display:block;")
          d3.select("#new-york-info").attr("style","display:none;")
          d3.select("#santa-clara-info").attr("style","display:none;")
        }
      });

      const outline = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#175e54")
      .attr("stroke-width", "3")
      .attr("stroke-linejoin", "round")
      .attr("pointer-events", "none");

      d3.select("#santa-clara-link").on("click", () => {d3.select("#santa-clara-info").attr("style","display:block;")})


    d3.select("svg").append("g")
    .selectAll("path")
    .data(counties)
    .join("path")      
      .attr("fill", d => color(d.data.status))
      .attr("d", path)
      .on("click", d => console.log(d.id))

  }

var promises = [];

promises.push(d3.csv('d3-data/county_data.csv'))
promises.push(d3.json('d3-data/counties-albers-10m.json'))

Promise.all(promises).then(function(values) {
    drawGraph(values)
});