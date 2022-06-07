import React, { Component } from "react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import * as Plotly from "plotly.js";

class ScatterPlot extends Component {
  state = {
    num_clusters: 0,
    clusterColors: [],
  };
  componentDidMount = () => {
    this.showPlot();
  };
  componentDidUpdate = () => {
    this.showPlot();
  };
  showPlot = () => {
    return Plotly.newPlot("mainScatter", this.props.data, this.props.layout, {
      toImageButtonOptions: {
        filename: this.props.plotTitle,
        width: this.props.picWidth,
        height: this.props.picHeight,
        format: this.props.picFormat,
      },
    });
  };
  render() {
    return <div id="mainScatter" style={styles.scatterContainer}></div>;
  }
}
ScatterPlot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
  plotTitle: PropTypes.string,
};
const styles = {
  scatterContainer: {
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    left: 0,
    marginTop: "13%",
    marginLeft: "23%",
    width: "55%",
    height: "74%",
  },
};
export default ScatterPlot;
