// Define the desired width and height
const width = 800;
const height = 800;

// Define the desired scale
const scale = 1100; // Adjust the scale value as needed

// Create an SVG element with the specified width and height
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create a projection of Australia using Albers equal-area projection
const projection = d3.geoAlbers()
  .center([0, -25])
  .rotate([-135, 0])
  .parallels([-18, -36])
  .scale(scale) // Use the variable scale
  .translate([width / 2, height / 2]);

// Create a path generator
const path = d3.geoPath().projection(projection);

// Function to load CSV data based on the selected year
function loadCSVData(selectedYear) {
  const csvFileName = `CSV/states${selectedYear}.csv`;
  return d3.csv(csvFileName);
}

// Load the GeoJSON data
d3.json("aus_state.geojson").then(function(geojson) {
  // Draw the map
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "#ccc")
    .on("mouseover", function() {
      d3.select(this).classed("hovered", true); // Apply hover effect
    })
    .on("mouseout", function() {
      d3.select(this).classed("hovered", false); // Remove hover effect
    });

  // Add state labels with MIGRANT value
    svg.selectAll("text")
    .data(geojson.features)
    .enter()
    .append("text")
    .attr("x", function(d) {
    return path.centroid(d)[0];
    })
    .attr("y", function(d) {
    const centroidY = path.centroid(d)[1];
    const bbox = this.getBBox();
    return centroidY + bbox.height / 2; // Adjust the y position for vertical center alignment
    })
    .style("font-size", "16px") // Change the font size to your desired value
    .text(function(d) {
    return ""; // No labels initially
    });

  // Add the year slider below the map
const sliderContainer = d3.select(".container-two-content")
  .append("div")
  .attr("id", "sliderContainer")
  .style("text-align", "center"); // Center the slider container

const yearSlider = sliderContainer.append("input")
  .attr("type", "range")
  .attr("id", "yearSlider")
  .attr("min", "2004")
  .attr("max", "2023")
  .attr("value", "2023")
  .attr("step", "1")
  .style("width", "80%") // Set the width of the slider
  .style("margin", "10px 0") // Add some margin around the slider
  .style("background-color", "grey") // Set the background color to grey
  .style("border", "none") // Remove the border
  .style("appearance", "none") // Remove the default appearance
  .style("height", "8px") // Set the height of the slider
  .style("border-radius", "4px") // Add border-radius to make it rounded
  .style("cursor", "pointer") // Add pointer cursor
  .on("input", function() {
    // Update the current year text
    d3.select("#currentYear").text(this.value);
  });

yearSlider.on("mouseover", function() {
  // Change the color of the thumb on hover
  d3.select(this).style("background-color", "lightgrey");
});

yearSlider.on("mouseout", function() {
  // Restore the color of the thumb when not hovered
  d3.select(this).style("background-color", "grey");
});

sliderContainer.append("div")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .style("font-size", "25px") // Adjust the font size
  .style("font-weight", "bold")
  .text("Year: ")
  .append("span")
  .attr("id", "currentYear")
  .style("font-size", "25px") // Adjust the font size
  .style("font-weight", "bold") // Set the font weight to bold
  .text("2023");





  // Handle slider input event
  yearSlider.on("input", function() {
    const selectedYear = this.value;
    d3.select("#currentYear").text(selectedYear);

    // Load the CSV data for the selected year
    loadCSVData(selectedYear).then(function(csvData) {
      // Convert the MIGRANT values to numbers
      csvData.forEach(function(d) {
        d.MIGRANT = +d.MIGRANT;
      });

      // State code to label mapping object
      const stateLabels = {
        "1": "NSW",
        "2": "VIC",
        "3": "QLD",
        "4": "SA",
        "5": "WA",
        "6": "TAS",
        "7": "NT",
        "8": "ACT"
      };

      // Create a mapping of STATE_CODE to MIGRANT value
      const migrantMap = {};
      csvData.forEach(function(d) {
        migrantMap[d.STATE_CODE] = d.MIGRANT;
      });

      // Create the color scale
      const color = d3.scaleQuantize()
      .range(["rgb(240, 240, 240)", "rgb(217, 217, 217)", "rgb(189, 189, 189)", "rgb(150, 150, 150)", "rgb(115, 115, 115)", "rgb(82, 82, 82)"]);

      color.domain([
        d3.min(csvData, function(d) { return d.MIGRANT; }),
        d3.max(csvData, function(d) { return d.MIGRANT; })
      ]);

      // Update the map colors based on the selected year
      svg.selectAll("path")
        .style("fill", function(d) {
          const stateCode = String(d.properties.STATE_CODE);
          const migrantValue = migrantMap[stateCode];
          return migrantValue ? color(migrantValue) : "#ccc";
        });

      // Update state labels with MIGRANT value
      svg.selectAll("text")
        .text(function(d) {
          const stateCode = String(d.properties.STATE_CODE);
          if (stateCode === "9") {
            return ""; // Return empty string for STATE_CODE 9
          }
          const migrantValue = migrantMap[stateCode];
          const migrantText = migrantValue ? migrantValue.toLocaleString() : "";
          const stateLabel = stateLabels[stateCode] || "";
          return stateLabel + " (" + migrantText + " Migrants)";
        });
    });
  });

  // Load the CSV data for the initial year (2023)
  loadCSVData("2023").then(function(csvData) {
    // Convert the MIGRANT values to numbers
    csvData.forEach(function(d) {
      d.MIGRANT = +d.MIGRANT;
    });

    // State code to label mapping object
    const stateLabels = {
      "1": "NSW",
      "2": "VIC",
      "3": "QLD",
      "4": "SA",
      "5": "WA",
      "6": "TAS",
      "7": "NT",
      "8": "ACT"
    };

    // Create a mapping of STATE_CODE to MIGRANT value
    const migrantMap = {};
    csvData.forEach(function(d) {
      migrantMap[d.STATE_CODE] = d.MIGRANT;
    });

    // Create the color scale
    const color = d3.scaleQuantize()
    .range(["rgb(240, 240, 240)", "rgb(217, 217, 217)", "rgb(189, 189, 189)", "rgb(150, 150, 150)", "rgb(115, 115, 115)", "rgb(82, 82, 82)"]);

    color.domain([
      d3.min(csvData, function(d) { return d.MIGRANT; }),
      d3.max(csvData, function(d) { return d.MIGRANT; })
    ]);

    // Update the map colors for the initial year
    svg.selectAll("path")
      .style("fill", function(d) {
        const stateCode = String(d.properties.STATE_CODE);
        const migrantValue = migrantMap[stateCode];
        return migrantValue ? color(migrantValue) : "#ccc";
      });

    // Update state labels with MIGRANT value for the initial year
    svg.selectAll("text")
      .text(function(d) {
        const stateCode = String(d.properties.STATE_CODE);
        if (stateCode === "9") {
          return ""; // Return empty string for STATE_CODE 9
        }
        const migrantValue = migrantMap[stateCode];
        const migrantText = migrantValue ? migrantValue.toLocaleString() : "";
        const stateLabel = stateLabels[stateCode] || "";
        return stateLabel + " (" + migrantText + " Migrants)";
      });
  });
});