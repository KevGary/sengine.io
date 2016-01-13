var width = 1400,
    height = 165;

var vertices = d3.range(100).map(function(d) {
  return [Math.random() * width, Math.random() * height];
});

var voronoi = d3.geom.voronoi()
    .clipExtent([[0, 0], [width, height]]);

var svg = d3.select(".d3Append").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", function() { vertices[0] = d3.mouse(this); redraw(); });

var path = svg.append("g").selectAll("path");

svg.append("text").attr("x", 475).attr("y", 110).attr("font-size", "70px").attr("font-weight", "bold").text("Sengine.io");

svg.selectAll("circle")
    .data(vertices.slice(1))
  .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + d + ")"; })
    .attr("r", 1.5);

redraw();

function redraw() {
  path = path
      .data(voronoi(vertices), polygon);

  path.exit().remove();

  path.enter().append("path")
      .attr("class", function(d, i) { return "q" + (i % 9) + "-9"; })
      .attr("d", polygon);

  path.order();
}

function polygon(d) {
  return "M" + d.join("L") + "Z";
}