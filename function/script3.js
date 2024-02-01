// Load data from CSV file
d3.csv("CSV/linegraph.csv").then(function (data) {
  // Convert data types
  data.forEach(function (d) {
    d.x = +d.x;
    d.y1 = +d.y1;
    d.y2 = +d.y2;
  });

  // Chart dimensions
  const width = 1000;
  const height = 800;
  const margin = { top: 20, right: 20, bottom: 100, left: 100 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Create xScale and yScale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x))
    .range([margin.left, margin.left + chartWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => Math.max(d.y1, d.y2))])
    .range([margin.top + chartHeight, margin.top]);

  // Create line generator functions
  const line1 = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y1));

  const line2 = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y2));

  // Create area generator functions
  const area1 = d3
    .area()
    .x((d) => xScale(d.x))
    .y0(yScale(0))
    .y1((d) => yScale(d.y1));

  const area2 = d3
    .area()
    .x((d) => xScale(d.x))
    .y0(yScale(0))
    .y1((d) => yScale(d.y2));

  // Create SVG element
  const svg = d3.select("#chart").attr("width", width).attr("height", height);

  // Draw lines
  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line1)
    .attr("stroke", "orange");

  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line2)
    .attr("stroke", "blue");

  // Draw shaded areas
  svg.append("path").datum(data).attr("class", "area area-red").attr("d", area1);

  svg.append("path").datum(data).attr("class", "area area-blue").attr("d", area2);

  // Add circles for each data point on the red line
  svg
    .selectAll(".dot-red")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot-red")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y1))
    .attr("r", 4)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // Add circles for each data point on the blue line
  svg
    .selectAll(".dot-blue")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot-blue")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y2))
    .attr("r", 4)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // Add axes
const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickPadding(10).tickSize(8);
const yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(10).tickSize(8);
xAxis.tickFormat((d) => d); // Optional: Customize x-axis tick label formatting
yAxis.tickFormat((d) => d); // Optional: Customize y-axis tick label formatting

svg
  .append("g")
  .attr("transform", `translate(0, ${margin.top + chartHeight})`)
  .call(xAxis)
  .selectAll("text")
  .attr("font-weight", "bold")
  .style("font-size", "15px"); // Increase font size for x-axis tick labels

svg
  .append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(yAxis)
  .selectAll("text")
  .attr("font-weight", "bold")
  .style("font-size", "15px") // Increase font size for y-axis tick labels
  .attr("dx", "-7px"); // Move the y-axis labels to the left by 5 pixels


  // Add x-axis label
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height - 20)
    .style("text-anchor", "middle")
    .text("Age")
    .attr("font-weight", "bold")
    .style("font-size", "25px"); // Increase font size for x-axis label

  // Add y-axis label
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", margin.left / 2 - 20)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Thousands")
    .attr("font-weight", "bold")
    .style("font-size", "25px"); // Increase font size for y-axis label

  // Tooltip
  const tooltip = d3.select(".tooltip");

  function handleMouseOver(event, d) {
    const xPosition = event.pageX;
    const yPosition = event.pageY - 10;

    tooltip
      .style("display", "block")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px")
      .text(`(${d.x}, ${d.y1})`);
  }

  function handleMouseOut() {
    tooltip.style("display", "none");
  }

  // Legend
const legend = d3.select(".legend");

const legendData = [
  { color: "orange", label: "2021-2022 Males" },
  { color: "grey", label: "2021-2022 Females" },
];

const legendItems = legend
  .selectAll(".legend-item")
  .data(legendData)
  .enter()
  .append("div")
  .attr("class", "legend-item");

legendItems
  .append("div")
  .attr("class", "legend-color")
  .style("background-color", (d) => d.color);

legendItems
  .append("span")
  .text((d) => d.label)
  .style("font-size", "20px"); // Increase the font size for legend text

});
