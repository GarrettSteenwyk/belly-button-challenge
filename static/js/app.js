function init() {
    const selector = d3.select("#selDataset");
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      const sampleNames = data.names;
  
      for (const sample of sampleNames) {
        selector.append("option").text(sample).property("value", sample);
      }
  
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  // Demographics Panel
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      const metadata = data.metadata;
      const resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
      const result = resultArray[0];
      const PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      for (const [key, value] of Object.entries(result)) {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      }
    });
  }
  
  // Creating a buildCharts function
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      const config = {
        displaylogo: false, // Hides the plotly logo on the bar
      };
      const samples = data.samples;
      let resultArray = samples.filter(
        (sampleNumber) => sampleNumber.id == sample
      );
      let result = resultArray[0];
  
      const [otu_ids, otu_labels, sample_values] = [
        result.otu_ids
          .slice(0, 10)
          .map((i) => "OTU " + i.toString())
          .reverse(),
        result.otu_labels.slice(0, 10).reverse(),
        result.sample_values.slice(0, 10).reverse(),
      ];
  
      // Create the trace for the bar chart
      let trace = {
        x: sample_values,
        y: otu_ids,
        hovertext: otu_labels,
        hoverinfo: "text",
        type: "bar",
        orientation: "h",
      };
  
      const barData = [trace];
  
      // Create its layout
      const barLayout = {
        font: {
          family: "Roboto",
        },
        plot_bgcolor: "#F8FAFC",
        paper_bgcolor: "#F8FAFC",
      };
      Plotly.react("bar", barData, barLayout, config);
  
      // Create the trace for the bubble one
      trace = {
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: "markers",
        marker: {
          color: result.sample_values,
          colorscale: "Portland",
          size: result.sample_values,
          sizeref: (2.0 * Math.max(...result.sample_values)) / 100 ** 2,
          sizemode: "area",
        },
      };
  
      const bubbleData = [trace];
  
      // Create its layout
      const bubbleLayout = {
        xaxis: { title: "OTU ID" },
        hovermode: "x unified",
        font: {
          family: "Roboto",
        },
        plot_bgcolor: "#F8FAFC",
        paper_bgcolor: "#F8FAFC",
      };
      Plotly.react("bubble", bubbleData, bubbleLayout, config);
    });
  }