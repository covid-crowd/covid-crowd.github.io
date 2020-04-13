// global variables used across all charts
var padding = 20;
var width = 975;
var height = 610;
var add_county_info;

function drawGraph(values) {    
  var path = d3.geoPath();
  
  const color = function (x) {
    if (x == 0){ return "none"; }
    if (x == 1){ return "#eaab00"; }
    if (x == 2){ return "#ffe607"; }
    if (x == 3){ return "#ff0000"; }
  }
  
  Date.prototype.to_string = function ()  {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };  
    return this.toLocaleString('en-US', options)
  }

  function get_business_string (county) {
    data = county.intervention_data

    return get_question_string("Non-essential businesses", data.business_closed, 
      data.business_closed_date, data.business_closed_url, data.business_open,
       data.business_open_date, data.business_open_url)
  }

  function get_school_string(county) {
    data = county.intervention_data

    return get_question_string("K-12 schools", data.school_closed, 
      data.school_closed_date, data.school_closed_url, data.school_open,
       data.school_open_date, data.school_open_url)
  }

  function get_college_string(county) {
    data = county.intervention_data

    return get_question_string("Colleges and/or universities", data.school_closed, 
      data.school_closed_date, data.school_closed_url, data.school_open,
       data.school_open_date, data.school_open_url)
  }

  function get_question_string(plural_entity_name, closed, closed_date, closed_url, open, open_date, open_url) {
    if (closed != "Yes")
    {
      question_string = "<div>" + plural_entity_name + " remain open."
    }
    else {
      question_string = "<div>" + plural_entity_name + " were closed"
      if (closed_date)
      {
        question_string += " on " + new Date(closed_date).to_string() + ".";
      }
      else {
         question_string += ", no date provided."
      }
    }
    if (closed_url) {
      question_string += ' (<a target="_blank" href="' + closed_url + '">Source</a>)'
    }
    else {
      question_string += " (Missing source)"
    }
    if (open == "Yes") {
      question_string += " " + plural_entity_name + " were reopened"  
      if (open_date)
      {
        question_string += " on " + new Date(open_date).to_string() + ".";
      }
      else {
         question_string += ", no date provided."
      }
      if (open_url) {
        question_string += ' (<a target="_blank" href="' + open_url + '">Source</a>)'
      }
      else {
        question_string += " (Missing source)"
      }
    }
    question_string += "</div>"
    return question_string
  }

  function get_religion_string(county) {
    data = county.intervention_data
    if (data.religion_closed != "Yes")
    {
      question_string = "<div>Religious gatherings continue to take place"
    }
    else {
      question_string = "<div>Some or all religious gatherings ceased"
      if (data.religion_closed_date)
      {
        question_string += " on " + new Date(data.religion_closed_date).to_string() + ".";
      }
      else {
         question_string += ", no date provided."
      }
      
    }
    if (data.religion_closed_url) {
        question_string += ' (<a target="_blank" href="' + data.religion_closed_url + '">Source</a>)'
    }
    else {
        question_string += " (Missing source)"
    }
    if (data.religion_open == "Yes") {
      question_string += "Religious gatherings resumed"  
      if (data.religion_open_date)
      {
        question_string += " on " + new Date(data.religion_open_date).to_string() + ".";
      }
      else {
         question_string += ", no date provided."
      }
      if (data.religion_open_url) {
        question_string += ' (<a target="_blank" href="' + data.religion_open_url + '">Source</a>)'
      }
      else {
        question_string += " (Missing source)"
      }
    }
    question_string += "</div>"
    return question_string
  }

  function get_lockdown_string(county) {
    data = county.intervention_data
    if (data.lockdown_closed != "Yes")
    {
      question_string = "<div>No order to stay at home has been put in place."
    }
    else {
      question_string = "<div>An order to stay at home has been put in place"
      if (data.lockdown_closed_date)
      {
        question_string += " on " + new Date(data.lockdown_closed_date).to_string() + ".";
      }
      else {
         question_string += ", no date provided."
      }
      
    }
    if (data.lockdown_closed_url) {
      question_string += ' (<a target="_blank" href="' + data.lockdown_closed_url + '">Source</a>)'
    }
    else {
      question_string += " (Missing source)"
    }
    if (data.lockdown_open == "Yes") {
      question_string += "The was lifted"  
      if (data.lockdown_open_date)
      {
        question_string += " on " + new Date(data.lockdown_open_date).to_string() + ".";
      }
      else {
         question_string += ", no date provided."
      }
      if (data.lockdown_open_url) {
        question_string += ' (<a target="_blank" href="' + data.lockdown_open_url + '">Source</a>)'
      }
      else {
        question_string += " (Missing source)"
      }
    }
    question_string += "</div>"
    return question_string
  }

  add_county_info = function(id) {
    county = counties.find(function (d) { return d.id === id });
    var div_content = `<div class="pill main-pill"><h4> ${county.data.CTYNAME} </h4></div><br> <div class="county-text">` + 
      get_business_string(county) + get_school_string(county) + get_college_string(county)  + 
      get_religion_string(county) + get_lockdown_string(county) + "</div>"

    document.getElementById("county-info").innerHTML = div_content;
    
  }

  const add_state_info = function(d,counties_in_state,state)  {

    //`<p><b class="status-2">We have complete data from these ${} counties: ${county_names}`
    
    document.getElementById("county-info").innerHTML = "";

    counties_with_intervention_data = counties_in_state.filter(function(item) {
        return item.intervention_data != undefined;
    })

    county_names = counties_with_intervention_data.map(function (item) {
        return `<div class="pill"><a onclick="add_county_info('${item.id}')">${item.properties.name}</a></div>`
    }).join(" ")

    var partial_counties, no_data_counties;
    num_partial_counties = counties_with_intervention_data.length;

    if (num_partial_counties == 0)
    {
      partial_counties = '';
    } 
    else if (num_partial_counties == 1) {
      partial_counties = `<p><b class="status-1">We have partial data from one ` + 
            `county, but need more info from residents! </b><br> `+
            `${county_names}</p>`  
    }
    else {
        partial_counties = `<p><b class="status-1">We have partial data from these ` + 
            `${num_partial_counties} counties, but need more info from residents! </b><br>`+
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

    var div_content = `<div class="pill main-pill"><h4> ${state} </h4></div>                
                      ${partial_counties}  
                      ${no_data_counties}
                      `
    document.getElementById("state-info").innerHTML = div_content;
  }

  var county_data = values[0];
  var us = values[1];
  var intervention_data = values[2];
  var unverified_data = values[3];
  var external_data = values[4];

  var states = topojson.feature(us, us.objects.states).features;
  var counties = topojson.feature(us, us.objects.counties).features;

  // add the data from county_data and intervention_data
  // into the data array that we get from topojson
  counties.forEach(function (item) {
      item.data = county_data.find(function (d) { return d.id === item.id; })
      item.intervention_data = undefined;
  });

  unverified_data.forEach(function (item) {
      county = counties.find(function (d) { return d.id === item.fips })
      if (county.data.status == 0) {county.data.status = 3;}
  });

  intervention_data.forEach(function (item) {
      county = counties.find(function (d) { return d.id === item.fips })
      county.intervention_data = item;
      county.data.status = 1;
  });

  external_data.forEach(function (item) {
      county = counties.find(function (d) { return d.id === item.fips })
      county.external_data = item;
  });

  d3.select("#counter").html(intervention_data.length + "/" + counties.length);

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
    .attr("opacity", d => d.data.status == 3 ? 0.4 : 0.8)
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
  add_county_info("06075")

  d3.select("#santa-clara-link").on("click", () => {d3.select("#santa-clara-info").attr("style","display:block;")})

  var svg2 = d3.select("#mapcontainer2");  
  svg2.html(svg_string);

  d3.select("#mapcontainer2 > svg").append("g")
  .selectAll("path")
  .data(counties)
  .join("path")      
    .attr("fill", d => d.external_data ? "blue" : "none")
    .attr("opacity", 0.4)
    .attr("d", path)
}

var promises = [];

promises.push(d3.csv('d3-data/county_data.csv'))
promises.push(d3.json('d3-data/counties-albers-10m.json'))
promises.push(d3.csv('d3-data/intervention_data.csv'))
promises.push(d3.csv('d3-data/unverified_data.csv'))
promises.push(d3.csv('d3-data/external_data.csv'))

Promise.all(promises).then(function(values) {
    drawGraph(values)
});