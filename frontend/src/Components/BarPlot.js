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
  assignClusterToRow = (row) => {
      // returns index of maximum value
      // unless max and second max are less than 0.2 apart
       
      const rowDescending = [...row].sort((a,b) => b - a)
      if (rowDescending[0] - rowDescending[1] < 0.2){
          return row.length;
      } else{
          return row.indexOf(rowDescending[0])
      }
  }
   range = (start, end) => {
	/* generate a range : [start, start+1, ..., end-1, end] */
	var len = end - start + 1;
	var a = new Array(len);
	for (let i = 0; i < len; i++) a[i] = start + i;
	return a;
}
  BarPlotFromData = () => {
    var x_clusters = [];
    var y_clusters = [];
    var colors = [];
    var data_new = [];
    if (this.props.data !== [] && this.props.data != null) {
      const num_clusters = Object.keys(this.props.data[0]).length

      for (var num_cl1 = 0; num_cl1 < num_clusters; num_cl1++) {
        x_clusters.push([]);
        y_clusters.push([]);
        for (var num_cl2 = 0; num_cl2 < num_clusters + 1; num_cl2++) {
            x_clusters[num_cl1].push([]);
            y_clusters[num_cl1].push([]);
        }
      }
      for (let j = 0; j < num_clusters; j += 1) {
        colors.push(randomColors[j]);
      }
      for (var i = 0; i < this.props.data.length; i++) {
        let rowCol = this.props.data[i];
        let maxCluster = this.assignClusterToRow(Object.values(rowCol).map(a => {
            return parseFloat(a)
        }));
        // console.log(maxCluster)
        for (var j = 0; j < num_clusters; j++) {
          x_clusters[j][maxCluster].push(this.props.data.length * maxCluster + i);  
          y_clusters[j][maxCluster].push(rowCol['v' + (j+1)]);
          }
      }
      for (var k = 0; k < num_clusters; k += 1) {
        data_new.push({
            type: 'bar',
            name: k,
            x: this.range(0, x_clusters[k].flat(1).length),
            y: y_clusters[k].flat(1),
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
