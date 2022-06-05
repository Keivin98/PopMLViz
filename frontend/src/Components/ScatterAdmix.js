import React, { Component } from "react";
import * as Plotly from "plotly.js";
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

class ScatterAdmix extends Component {
  constructor() {
    super();
    this.state = {
      clusterColors: [],
      clusterNames: [],
      PCAdata: [],
      alphaVal: 1,
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
      this.ScatterAdmixFromData();
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.alphaVal !== this.props.alphaVal ||
      prevProps.outlierData !== this.props.outlierData
    ) {
      this.splitPCAandADMIX();
    }
    if (
      JSON.stringify(prevProps.clusterNames) !==
      JSON.stringify(this.props.clusterNames)
    ) {
      this.setState({ clusterNames: this.props.clusterNames });
    }
    this.ScatterAdmixFromData();
  }
  scatterWithClusters(DIM, x, y, z, outliers, outlierData) {
    let num_clusters =
      this.props.AdmixData == null
        ? 0
        : Object.values(this.props.AdmixData[0]).length;
    console.log(num_clusters);
    var x_clusters = [];
    var y_clusters = [];
    var layout = {};
    if (DIM === 2) {
      var z_clusters = [];
    }
    var cluster_texts = [];
    if (outliers) {
      var x_clusters_outliers = [];
      var y_clusters_outliers = [];
      if (DIM === 2) {
        var z_clusters_outliers = [];
      }
    }
    for (var num_cl = 0; num_cl < num_clusters + 1; num_cl++) {
      x_clusters.push([]);
      y_clusters.push([]);
      if (DIM === 2) {
        z_clusters.push([]);
      }
      if (outliers) {
        x_clusters_outliers.push([]);
        y_clusters_outliers.push([]);
        if (DIM === 2) {
          z_clusters_outliers.push([]);
        }
      }
      cluster_texts.push([]);
    }

    var colors = [];

    for (let j = 0; j < num_clusters + 1; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.props.PCAdata != null) {
      for (var i = 0; i < this.props.PCAdata.length; i++) {
        let rowCol = this.state.clusterColors[i];
        if (rowCol !== undefined) {
          if (outliers && outlierData[i]) {
            if (DIM === 0) {
              x_clusters_outliers[rowCol].push(i);
              y_clusters_outliers[rowCol].push(this.props.PCAdata[i][x]);
            } else if (DIM === 1) {
              x_clusters_outliers[rowCol].push(this.props.PCAdata[i][x]);
              y_clusters_outliers[rowCol].push(this.props.PCAdata[i][y]);
            } else {
              x_clusters_outliers[rowCol].push(this.props.PCAdata[i][x]);
              y_clusters_outliers[rowCol].push(this.props.PCAdata[i][y]);
              z_clusters_outliers[rowCol].push(this.props.PCAdata[i][z]);
            }
          } else {
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
        }
      }
      var data_new = [];
      for (var k = 0; k < num_clusters + 1; k += 1) {
        var name = !(k in this.state.clusterNames)
          ? k == num_clusters
            ? "Undefined Cluster"
            : "Cluster " + k
          : this.state.clusterNames[k];
        var symbol = k === num_clusters ? "triangle" : "circle";
        var color = k === num_clusters ? "#bfbfbf" : colors[k];
        if (outliers) {
          if (DIM === 2) {
            data_new.push({
              name: "Outliers " + name,
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              z: z_clusters_outliers[k],
              mode: "markers",
              type: "scatter3d",
              marker: {
                color: color,
                size: 4,
                symbol: "cross",
                opacity: 0.5,
              },
              text: cluster_texts[k],
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}, %{z:.4f}) </i>",
            });
          } else {
            data_new.push({
              name: "Outliers " + name,
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              mode: "markers",
              marker: {
                color: color,
                size: 8,
                symbol: "cross",
                opacity: 0.5,
              },
              text: cluster_texts[k],
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}</i>",
            });
          }
        }
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
            marker: { color: color, size: 8, symbol: symbol },
            text: cluster_texts[k],
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
          });
        }
      }
    }
    var plot_title = this.props.plotTitle;

    if (DIM === 2) {
      layout = {
        // autosize: true,
        // showlegend: false,
        legend: {
          yanchor: "top",
          y: 0.99,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
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
            // zeroline: false,
            title: x,
          },
          yaxis: {
            type: "linear",
            // zeroline: false,
            title: y,
          },
          zaxis: {
            type: "linear",
            // zeroline: false,
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
    return Plotly.newPlot("scatterAdmix", data_new, layout, {
      toImageButtonOptions: {
        filename: this.props.plotTitle,
        width: this.props.picWidth,
        height: this.props.picHeight,
        format: this.props.picFormat,
      },
    });
  }
  splitPCAandADMIX = () => {
    let clusterColors = this.props.AdmixData.map((row) => {
      return this.assignClusterToRow(row);
    });
    let clusterNames =
      Object.values(this.props.clusterNames).length > 0
        ? this.props.clusterNames
        : this.range(0, Object.values(this.props.AdmixData[0]).length + 1).map(
            (num) => {
              return num < Object.values(this.props.AdmixData[0]).length
                ? "Cluster " + num
                : "Admixed Cluster";
            }
          );
    this.setState(
      {
        clusterNames: clusterNames,
        clusterColors: clusterColors,
        alphaval: this.props.alphaVal,
        numClusters: Object.values(this.props.AdmixData[0]).length,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      }
    );
  };

  ScatterAdmixFromData = () => {
    let DIMS = [this.props.x, this.props.y, this.props.z]
      .map((dim) => {
        return dim == null ? 0 : 1;
      })
      .reduce((total, curr) => (total = total + curr), 0);

    if (this.props.PCAdata == null || DIMS === 0) {
      return Plotly.newPlot(
        "scatterAdmix",
        [],
        {},
        {
          toImageButtonOptions: {
            filename: this.props.plotTitle,
            width: this.props.picWidth,
            height: this.props.picHeight,
            format: this.props.picFormat,
          },
        }
      );
    } else {
      if (this.props.outlierData.length > 0) {
        return this.scatterWithClusters(
          DIMS - 1,
          this.props.x,
          this.props.y,
          this.props.z,
          true,
          this.props.outlierData
        );
      } else {
        return this.scatterWithClusters(
          DIMS - 1,
          this.props.x,
          this.props.y,
          this.props.z,
          false,
          null
        );
      }
    }
  };

  render() {
    return <div id="scatterAdmix" style={styles.ScatterContainer}></div>;
  }
}
ScatterAdmix.propTypes = {
  PCAdata: PropTypes.array,
  AdmixData: PropTypes.array,
  alphaVal: PropTypes.number,
  x: PropTypes.string,
  y: PropTypes.string,
  z: PropTypes.string,
  clusterNames: PropTypes.array,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
  plotTitle: PropTypes.string,
};
const styles = {
  ScatterContainer: {
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    left: 0,
    marginTop: "13%",
    marginLeft: "26%",
    width: "52%",
    height: "73%",
  },
};
export default ScatterAdmix;
