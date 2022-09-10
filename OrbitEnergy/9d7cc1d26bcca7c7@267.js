// https://observablehq.com/@d3/contours@267
import define1 from "./a33468b95d0b15b0@808.js";

function _1(md){return(
md`# Contours

Showing the Energy of Orbits.`
)}

function _value(){return(
(x, y) =>
  _energy(_radius("Earth") + x * 1000, _radius("Earth") + y * 1000)
)}

function _apo_after_100ms_accel(peri, apo) {
  if (peri > apo) {
    const temp = peri;
    peri = apo;
    apo = temp;
  }
  if (peri < 0.001) {
    return 0;
  }
  var vel = _vel_at_peri(peri, apo) + 100;
  var apot = _apo_of_peri_vel(peri, vel)
  //return (apot - _radius("Earth")) / 1000;
  return (apot - apo) / 1000;
}

function _apo_of_peri_vel(peri, vel) {
  var sm = 1 / (2 / peri - vel * vel / _mu("Earth"));
  return 2 * sm - peri;
}

// return energy of orbit peri and apo are the distance the the planets center in meters
function _energy(peri, apo) {
  if (peri > apo) {
    const temp = peri;
    peri = apo;
    apo = temp;
  }
  if (peri < 0.001) {
    return 0;
  }
  var e_k = Math.pow(_vel_at_peri(peri, apo), 2) / 2;
  var e_p = - _mu("Earth") / peri;
  var e = e_k + e_p
  var e_z = Math.pow(_vel_at_peri(_radius("Earth"), _radius("Earth")), 2) / 2 - _mu("Earth") / _radius("Earth");
  return e - e_z;
}


function _vel_at_peri(peri, apo) {
  return Math.sqrt(_mu("Earth") * (2 / peri - 1 / _semi_major_axis(peri, apo)))
}

function _semi_major_axis(peri, apo) {
  return (peri + apo) / 2;
}

function _mu(body) {
  if (body == "Earth") {
    return 3.986e14;
  }
  if (body == "Kerbin") {
    return 3.5316e12
  }
}

function _radius(body) {
  if (body == "Earth") {
    return 6.3781e6 ;
  }
  if (body == "Kerbin") {
    return 600000;
  }
}

function _3(Legend,color){return(
Legend(color, {title: "Value", tickFormat: ","})
)}

function _chart(d3,width,height,contours,color,xAxis,yAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("width", "calc(100%)");

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(contours)
    .join("path")
      .attr("fill", d => color(d.value))
      .attr("d", d3.geoPath());

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}


function _color(d3,thresholds){return(
d3.scaleSequentialLog(d3.extent(thresholds), d3.interpolateYlGn)
)}

function _thresholds(d3){return(
d3.range(1, 40).map(i => 27000000 + 5000000 / 40 * i)
)}

function _thresholds3(d3){return(
  d3.range(1, 30).map(i => Math.pow(2, i))
  )}

  function _thresholds2(d3){return(
  d3.range(1, 10).map(i => Math.pow(2, 20) * Math.pow(2, i))
  )}

function _grid(width,height,value,x,y)
{
  const q = 1; // The level of detail, e.g., sample every 4 pixels in x and y.
  const x0 = 0, x1 = width;
  const y0 = 0, y1 = height;
  const n = Math.ceil((x1 - x0) / q);
  const m = Math.ceil((y1 - y0) / q);
  const grid = new Array(n * m);
  for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
      grid[j * n + i] = value(x.invert(i * q + x0), y.invert(j * q + y0));
    }
  }
  grid.x = -q;
  grid.y = -q;
  grid.k = q;
  grid.n = n;
  grid.m = m;
  return grid;
}


function _transform(grid){return(
({type, value, coordinates}) => {
  return {type, value, coordinates: coordinates.map(rings => {
    return rings.map(points => {
      return points.map(([x, y]) => ([
        grid.x + grid.k * x,
        grid.y + grid.k * y
      ]));
    });
  })};
}
)}

function _contours(d3,grid,thresholds,transform){return(
d3.contours()
    .size([grid.n, grid.m])
    .thresholds(thresholds)
  (grid)
    .map(transform)
)}

function _x(d3,width){return(
d3.scaleLinear([0, 0.929e6], [0, width])
)}

function _y(d3,height){return(
d3.scaleLinear([0, 0.929e6], [height, 0])
)}

function _xAxis(height,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(width / height * 10))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => x.domain().includes(d)).remove())
)}

function _yAxis(d3,y){return(
g => g
    .attr("transform", "translate(-1,0)")
    .call(d3.axisRight(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => y.domain().includes(d)).remove())
)}

function _height(){return(
600
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("value")).define("value", _value);
  main.variable(observer()).define(["Legend","color"], _3);
  main.variable(observer("chart")).define("chart", ["d3","width","height","contours","color","xAxis","yAxis"], _chart);
  main.variable(observer("color")).define("color", ["d3","thresholds"], _color);
  main.variable(observer("thresholds")).define("thresholds", ["d3"], _thresholds);
  main.variable(observer("grid")).define("grid", ["width","height","value","x","y"], _grid);
  main.variable(observer("transform")).define("transform", ["grid"], _transform);
  main.variable(observer("contours")).define("contours", ["d3","grid","thresholds","transform"], _contours);
  main.variable(observer("x")).define("x", ["d3","width"], _x);
  main.variable(observer("y")).define("y", ["d3","height"], _y);
  main.variable(observer("xAxis")).define("xAxis", ["height","d3","x","width"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["d3","y"], _yAxis);
  main.variable(observer("height")).define("height", _height);
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  return main;
}
