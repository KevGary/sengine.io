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

// var filter = svg.append("defs").append("filter").attr("id", "dropshadow").attr("height", "130%");
// filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", "3")
// filter.append("feOffset").attr("dx", "2").attr("dy", "2").attr("result", "offsetblur")
// var merge = filter.append("feMerge");
// merge.append("feMergeNode");
// merge.append("feMergeNode").attr("in", "SourceGraphic");

// filters go in defs element
var defs = svg.append("defs");

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 5)
    .attr("dy", 5)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

svg.append("text").attr("x", 475).attr("y", 110).attr("font-size", "70px").attr("font-weight", "bold").attr("stroke-width", 2).style("filter", "url(#drop-shadow)").attr("class", "shadow").text("Sengine.io");
svg.append("text").attr("x", 475).attr("y", 110).attr("font-size", "70px").attr("font-weight", "bold").attr("stroke-width", 2).style("filter", "url(#drop-shadow)").text("Sengine.io");

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