// Set the width and height of the SVG element
var w = 900;
var h = 800;
var padding = 80;
var marginLeft = 150; // Increase the left margin

// Create the x and y scales
var xScale = d3.scaleBand()
  .rangeRound([padding, w - padding])
  .paddingInner(0.02); // Adjust the paddingInner value to make bars wider

var yScale = d3.scaleLinear()
  .range([h - padding, padding]);

// Create the color scale
const color = d3.scaleQuantize()
  .range(["rgb(240, 240, 240)", "rgb(217, 217, 217)", "rgb(189, 189, 189)", "rgb(150, 150, 150)", "rgb(115, 115, 115)", "rgb(82, 82, 82)"]);

// Create the SVG element
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", w + marginLeft) // Increase the width to accommodate the margin
  .attr("height", h)
  .append("g")
  .attr("transform", "translate(" + marginLeft + ",0)"); // Apply the left margin


// Load the data from the CSV file
d3.csv("CSV/ethnicstate.csv").then(function(data) {
  // Extract the necessary data from the loaded CSV
  var dataset = data.map(function(d) {
    return {
      STATE_CODE: d.STATE_CODE,
      MIGRANT: +d.MIGRANT, // Convert the MIGRANT values to numbers
      COUNTRY: d.COUNTRY
    };
  });

  // Store the original data separately
  var originalData = dataset.slice();

  // Store the original order of the dataset
  var originalOrder = d3.range(dataset.length);

  // Update the x and y scales with the new data
  xScale.domain(originalOrder);
  yScale.domain([0, d3.max(dataset, function(d) {
    return d.MIGRANT;
  })]);

  // Update the color scale domain
  color.domain(d3.extent(dataset, function(d) {
    return d.MIGRANT;
  }));

  // Create the bars
  svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScale(i);
  })
  .attr("y", function(d) {
    return yScale(d.MIGRANT);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) {
    return h - padding - yScale(d.MIGRANT);
  })
  .attr("fill", function(d) {
    return color(d.MIGRANT);
  })
  .on("mouseover", function(event, d) {
    d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", "orange");

    var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
    var yPosition = parseFloat(d3.select(this).attr("y")) + 20;

    svg.append("text")
      .attr("id", "tooltip")
      .attr("x", xPosition)
      .attr("y", yPosition)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .style("fill", "black")
      .style("font-size", "9px")
      .text(d.COUNTRY + ": " + d.MIGRANT); // Display both COUNTRY and MIGRANT values
  })
  .on("mouseout", function(event, d) {
    d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", function(d) {
        return color(d.MIGRANT);
      });

    svg.select("#tooltip").remove();
  });

  // Add labels to each bar
  svg.selectAll(".bar-label")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function(d, i) {
      return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function(d) {
      return yScale(d.MIGRANT) - 5;
    })
    

  // Add x-axis
  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(d3.axisBottom(xScale)
      .tickFormat(function(d, i) {
        return data[i].STATE_CODE; // Display STATE_CODE values on the x-axis ticks
      })
    )
    .selectAll("text")
    .attr("text-anchor", "middle") // Set the text anchor to the middle
    .attr("font-weight", "bold")
    .style("font-size", "15px"); // Increase the text size

  // Add y-axis labels
  svg.append("g")
  .attr("transform", "translate(" + padding + ",0)")
  .call(d3.axisLeft(yScale))
  .selectAll("text")
  .attr("font-weight", "bold")
  .style("font-size", "15px") // Increase the text size
  .attr("x", -15) // Adjust the x-coordinate to move the text to the left
  .attr("dy", "0.32em") // Adjust the vertical alignment if needed
  .style("text-anchor", "end"); // Set the text anchor to the end

// Add y-axis title
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -h / 2)
  .attr("y", padding / 7 - 25) // Adjust the y-coordinate to provide more space
  .attr("text-anchor", "end")
  .attr("font-weight", "bold")
  .style("font-size", "25px")
  .text("Groups of overseas-born residents");


// Add x-axis title
svg.append("text")
  .attr("x", w / 2 - 76)
  .attr("y", h - padding / 3 )
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .style("font-size", "25px")
  .text("States");

    

  // Define sort order flag
  var sortOrder = false;

  // Sort function
  var sortBars = function() {
    // Flip the value of sortOrder
    sortOrder = !sortOrder;

    svg.selectAll("rect")
      .sort(function(a, b) {
        if (sortOrder) {
          return d3.descending(a.MIGRANT, b.MIGRANT);
        } else {
          return d3.ascending(a.MIGRANT, b.MIGRANT);
        }
      })
      .transition()
      .duration(1000)
      .attr("x", function(d, i) {
        return xScale(i);
      });
  };

  // Bind click event to the buttons
  d3.select("#sort").on("click", sortBars);
  d3.select("#reset").on("click", function() {
    location.reload();
  });
});
