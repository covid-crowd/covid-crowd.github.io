  // global variables used across all charts
  var margin = {top: 30, right: 30, bottom: 60, left: 60};
  var width = Math.min(600,document.getElementsByClassName("container")[0].offsetWidth - 10);
  var height = 300;
  var start_day = new Date("2020-01-15");

  function update_dates(data) {
    data.map( function(x) {
        let d = new Date(); 
        d.setTime(start_day.getTime() + 86400000 * x.day); 
        x.day = d; return x;
    });
  }

  function drawGraph(data,svg_id,intervention_dates,title) {
    update_dates(data)
    console.log(data)
    const svg = d3.select("#" + svg_id)
    
    var g =  svg.append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")
  }

  function make_plot(data_file, svg_id, intervention_dates,title) {
            d3.csv(data_file).then(
                function(data) {
                    drawGraph(data,svg_id,intervention_dates,title)
                });   
    }
    

  
make_plot("","chart_1",[],"Crowdsourced Intervention Data")