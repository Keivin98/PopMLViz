import React, { Component } from "react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

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
  "#277f05",
];

var num_clusters = 5;

class ScatterAdmix extends Component {
  constructor() {
    super();
    this.state = {
      clusterColors: [],
      clusterNames: [],
      PCAdata: [],
      alphaVal: 0,
    };
  }
  range = (start, end) => {
    /* generate a range : [start, start+1, ..., end-1, end] */
    var len = end - start + 1;
    var a = new Array(len);
    for (let i = 0; i < len; i++) a[i] = start + i;
    return a;
  };
  assignClusterToRow = (row) => {
    // returns index of maximum value
    // unless max and second max are less than 0.2 apart
    var parsedRow = Object.values(row).map((a) => {
      return parseFloat(a);
    });
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    // if (rowDescending[0] - rowDescending[1] < 0.2) {
    //   return parsedRow.length;
    // }
    if (rowDescending[0] < this.props.alphaVal / 100.0) {
      return parsedRow.length;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  componentDidMount() {
    //Split the data between pca and admix
    if (this.props.data !== null) {
      this.setState({ alphaVal: this.props.alphaVal });
      this.splitPCAandADMIX();
    }
  }
  componentDidUpdate(prevProps) {
    console.log(this.props.alphaVal);
    if (prevProps.alphaVal !== this.props.alphaVal) {
      this.splitPCAandADMIX();
    }
  }
  scatterWithClusters(DIM, x, y, z) {
    var x_clusters = [];
    var y_clusters = [];
    var layout = {};
    if (DIM === 2) {
      var z_clusters = [];
    }
    var cluster_texts = [];

    for (var num_cl = 0; num_cl < num_clusters + 1; num_cl++) {
      x_clusters.push([]);
      y_clusters.push([]);
      if (DIM === 2) {
        z_clusters.push([]);
      }
      cluster_texts.push([]);
    }

    var colors = [];

    for (let j = 0; j < num_clusters + 1; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.props.PCAdata != null) {
      //   console.log(this.state.PCAdata);
      for (var i = 0; i < this.props.PCAdata.length; i++) {
        let rowCol = this.state.clusterColors[i];
        if (DIM === 0) {
          x_clusters[rowCol].push(i);
          y_clusters[rowCol].push(this.props.PCAdata[i][x]);
        } else if (DIM === 1) {
          x_clusters[rowCol].push(this.props.PCAdata[i][x]);
          y_clusters[rowCol].push(this.props.PCAdata[i][y]);
        } else {
          x_clusters[rowCol].push(this.props.PCAdata[i][x]);
          y_clusters[rowCol].push(this.props.PCAdata[i][y]);
          z_clusters[rowCol].push(this.props.PCAdata[i][z]);
        }
      }
      var data_new = [];
      for (var k = 0; k < num_clusters + 1; k += 1) {
        var name = this.state.clusterNames[k];
        var symbol = k == num_clusters ? "cross" : "circle";
        var color = k == num_clusters ? "grey" : colors[k];
        if (DIM === 2) {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            z: z_clusters[k],
            mode: "markers",
            type: "scatter3d",
            marker: { color: color, size: 4, symbol: symbol },
            text: cluster_texts[k],
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}, %{z:.4f}) </i>",
          });
        } else {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            mode: "markers",
            marker: { color: color, symbol: symbol },
            text: cluster_texts[k],
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
          });
        }
      }
    }
    var plot_title =
      DIM === 0
        ? "1D plot of " + x
        : DIM === 1
        ? "2D plot of " + x + " and " + y
        : "3D plot of " + x + ", " + y + " and " + z;

    if (DIM === 2) {
      layout = {
        autosize: true,
        scene: {
          aspectratio: {
            x: 1,
            y: 1,
            z: 1,
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0,
            },
            eye: {
              x: 1.25,
              y: 1.25,
              z: 1.25,
            },
            up: {
              x: 0,
              y: 0,
              z: 1,
            },
          },
          xaxis: {
            type: "linear",
            zeroline: false,
            title: x,
          },
          yaxis: {
            type: "linear",
            zeroline: false,
            title: y,
          },
          zaxis: {
            type: "linear",
            zeroline: false,
            title: z,
          },
        },
        title: plot_title,
      };
    } else {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    }
    console.log(data_new);
    return (
      <Plot data={data_new} layout={layout} style={styles.ScatterContainer} />
    );
  }
  splitPCAandADMIX = () => {
    let clusterColors = this.props.AdmixData.map((row) => {
      return this.assignClusterToRow(row);
    });
    let clusterNames = this.range(
      0,
      Object.values(this.props.AdmixData[0]).length + 1
    ).map((num) => {
      return num <= Object.values(this.props.AdmixData[0]).length
        ? "Cluster " + num
        : "Undefined Cluster";
    });
    // console.log(clusterNames);
    this.setState({
      clusterNames: clusterNames,
      clusterColors: clusterColors,
      alphaval: this.props.alphaVal,
    });
  };

  ScatterAdmixFromData = () => {
    let DIMS = [this.props.x, this.props.y, this.props.z]
      .map((dim) => {
        return dim == null ? 0 : 1;
      })
      .reduce((total, curr) => (total = total + curr), 0);
    if (this.props.PCAdata == null || DIMS <= 0) {
      return <Plot data={[]} style={styles.ScatterContainer} />;
    } else {
      return this.scatterWithClusters(
        DIMS - 1,
        this.props.x,
        this.props.y,
        this.props.z
      );
    }
  };

  render() {
    return <div>{this.ScatterAdmixFromData()}</div>;
  }
}
ScatterAdmix.propTypes = {
  PCAdata: PropTypes.array,
  AdmixData: PropTypes.array,
  alphaVal: PropTypes.number,
  x: PropTypes.string,
  y: PropTypes.string,
  z: PropTypes.string,
};
const styles = {
  ScatterContainer: {
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    left: 0,
    marginTop: "12%",
    marginLeft: "26%",
    width: "52%",
    height: "73%",
  },
};
export default ScatterAdmix;
