const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 100)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Publisher")

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

const x = d3.scaleBand()
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const y = d3.scaleLinear()
  .range([HEIGHT, 0])

const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")

d3.csv("data/superhero.csv").then(data => {
  data.forEach(d => {
    // d.Height = (Number(d.Height) <= 0) ?  0 : Number(d.Height);
    d.Weight = (Number(d.Weight) <= 0 || d.Weight === "-") ? 0 : Number(d.Weight);
    d.Height = (Number(d.Height) <= 0 || d.Height === "-") ? 0 : Number(d.Height);
  })

  console.log(data)

  d3.interval(() => {
    update(data)
  }, 1000)

  update(data)
})

function update(data) { 
  const option = document.querySelector('.form-control').value;
  const value = (option === "Height") ? "Height" : "Weight";
  const color = "#FAC05E";

  x.domain(data.map(d => d.Publisher))
  y.domain([0, d3.max(data, d => d[value])])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => d + "kg")
  yAxisGroup.call(yAxisCall)

  // JOIN new data with old elements.
  const rects = g.selectAll("rect")
    .data(data)

  // EXIT old elements not present in new data.
  rects.exit().remove()

  // UPDATE old elements present in new data.
  rects
    .attr("y", d => y(d[value]))
    .attr("x", (d) => x(d.Publisher))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d[value]))

  // ENTER new elements present in new data.  
  rects.enter().append("rect")
    .attr("y", d => y(d[value]))
    .attr("x", (d) => x(d.Publisher))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d[value]))
    .attr("fill", color)

//   const text = flag ? "Profit ($)" : "Revenue ($)"
  yLabel.text(value)
}