import React, { Component } from "react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

const randomColors = [
  "#1aa52a",
  "#7ddaed",
  "#0740ba",
  "#a3a6ed",
  "#cc9d3f",
  "#d87368",
  "#99f7a2",
  "#ff7ae6",
];
class ScatterPlot extends Component {
  constructor() {
    super();
    this.state = {
      num_clusters: 0,
      clusterColors: [],
    };
  }

  render() {
    return (
      <form style={{ marginTop: "30px" }}>
        {
          <Plot
            data={this.props.data}
            style={styles.scatterContainer}
            layout={this.props.layout}
          />
        }
      </form>
    );
  }
}
ScatterPlot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
};
const styles = {
  scatterContainer: {
    height: "70%",
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    padding_top: "20px",
    left: 0,
    backgroud_color: "red",
    width: "55%",
    marginTop: "10%",
    marginLeft: "30%",
  },
};
export default ScatterPlot;
