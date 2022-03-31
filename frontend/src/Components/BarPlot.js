import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const randomColors = [
    "#3f91ba",
    "#801f65",
    "#86af43",
    "#d73521",
    "#1d4c91",
    "#2c663b",
    "#cc9d3f",
    "#ff7ae6",
    "#d87368",
    "#99f7a2",
    "#a3a6ed",
    "#0740ba",
    "#277f05"
  ];
class BarPlot extends Component {
  constructor() {
    super();
    this.state = {
      num_clusters: 0,
      clusterColors: [],
    };
  }
  BarPlotFromData = () => {
    var x_clusters = [];
    var y_clusters = [];
    var colors = [];
    var data_new = [];
    if (this.props.data !== [] && this.props.data != null) {
      const num_clusters = Object.keys(this.props.data[0]).length

      for (var num_cl = 0; num_cl < num_clusters; num_cl++) {
        x_clusters.push([]);
        y_clusters.push([]);
      }
      for (let j = 0; j < num_clusters; j += 1) {
        colors.push(randomColors[j]);
      }
      for (var i = 0; i < this.props.data.length; i++) {
        let rowCol = this.props.data[i];
        for (var j = 0; j < num_clusters; j++) {
          x_clusters[j].push(i);  
          y_clusters[j].push(rowCol['v' + (j+1)]);
          }
      }
      for (var k = 0; k < this.props.data.length; k += 1) {
        data_new.push({
            type: 'bar',
            name: k,
            x: x_clusters[k],
            y: y_clusters[k],
          });
      }
    }
    return <Plot data={data_new} layout = {{barmode: 'stack'}}  style={styles.barContainer}/>;
  }

  render() {
    return (
        <div>
            {this.BarPlotFromData()}
        </div>
    );
  }
}
BarPlot.propTypes = {
  data: PropTypes.array,
};
const styles = {
    barContainer: {
      position: 'fixed',
      z_index: 1,
      top: 0,
      overflow_x: 'hidden',
      left: 0,
      marginTop: '12%',
      marginLeft: '26%',
      width: "52%",
      height: "73%"
    },
  };
export default BarPlot;
