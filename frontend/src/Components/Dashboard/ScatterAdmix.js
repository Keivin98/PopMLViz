import React, { useState, useEffect, useRef } from "react";
import * as Plotly from "plotly.js";
import PropTypes from "prop-types";
import "./dashboard.css";

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

const ScatterAdmix = ({
  PCAdata,
  AdmixData,
  alphaVal,
  certaintyVal,
  outlierData,
  x,
  y,
  z,
  clusterNames,
  onChange,
  plotTitle,
  picWidth,
  picHeight,
  picFormat,
  markerSize,
  admixMode,
}) => {
  const [state, setState] = useState({
    clusterColors: [],
    clusterNames: [],
    PCAdata: [],
    alphaVal: alphaVal,
    certaintyVal: certaintyVal,
    markerSize: markerSize,
    admixMode: admixMode,
  });

  const updatedLayout = {
    margin: {
      l: 20,
      r: 20,
      t: 20,
      b: 20,
    },
    autosize: true,
  };

  const scatterRef = useRef(null);

  const range = (start, end) => {
    var len = end - start + 1;
    var a = new Array(len);
    for (let i = 0; i < len; i++) a[i] = start + i;
    return a;
  };

  const assignClusterToRow1 = (row) => {
    var parsedRow = Object.values(row).map((a) => {
      return parseFloat(a);
    });
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] < alphaVal / 100.0) {
      return parsedRow.length;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  const assignClusterToRow2 = (row) => {
    var parsedRow = Object.values(row).map((a) => {
      return parseFloat(a);
    });
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] - rowDescending[1] < certaintyVal / 100.0) {
      return parsedRow.length;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  const handleResize = () => {
    if (scatterRef.current) {
      Plotly.Plots.resize(scatterRef.current);
    }
  };

  useEffect(() => {
    if (AdmixData !== null) {
      splitPCAandADMIX();
      scatterAdmixFromData();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [AdmixData, alphaVal, certaintyVal, admixMode, outlierData, clusterNames, markerSize, x, y, z]);

  const splitPCAandADMIX = () => {
    let clusterColors = AdmixData.map((row) => {
      if (admixMode === 0) {
        return assignClusterToRow1(row);
      } else {
        return assignClusterToRow2(row);
      }
    });
    let clusterNamesUpdated =
      Object.values(clusterNames).length > 0
        ? clusterNames
        : range(0, Object.values(AdmixData[0]).length + 1).map((num) => {
            return num < Object.values(AdmixData[0]).length ? "Cluster " + num : "Admixed Cluster";
          });

    setState((prevState) => ({
      ...prevState,
      clusterNames: clusterNamesUpdated,
      clusterColors: clusterColors,
      alphaVal: alphaVal,
      certaintyVal: certaintyVal,
      numClusters: Object.values(AdmixData[0]).length,
    }));

    if (onChange) {
      onChange(state);
    }
  };

  const scatterWithClusters = (DIM, x, y, z, outliers, outlierData) => {
    let num_clusters = AdmixData == null ? 0 : Object.values(AdmixData[0]).length;
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

    if (PCAdata != null) {
      for (var i = 0; i < PCAdata.length; i++) {
        let rowCol = state.clusterColors[i];
        if (rowCol !== undefined) {
          if (outliers && outlierData[i]) {
            if (DIM === 0) {
              x_clusters_outliers[rowCol].push(i);
              y_clusters_outliers[rowCol].push(PCAdata[i][x]);
            } else if (DIM === 1) {
              x_clusters_outliers[rowCol].push(PCAdata[i][x]);
              y_clusters_outliers[rowCol].push(PCAdata[i][y]);
            } else {
              x_clusters_outliers[rowCol].push(PCAdata[i][x]);
              y_clusters_outliers[rowCol].push(PCAdata[i][y]);
              z_clusters_outliers[rowCol].push(PCAdata[i][z]);
            }
          } else {
            if (DIM === 0) {
              x_clusters[rowCol].push(i);
              y_clusters[rowCol].push(PCAdata[i][x]);
            } else if (DIM === 1) {
              x_clusters[rowCol].push(PCAdata[i][x]);
              y_clusters[rowCol].push(PCAdata[i][y]);
            } else {
              x_clusters[rowCol].push(PCAdata[i][x]);
              y_clusters[rowCol].push(PCAdata[i][y]);
              z_clusters[rowCol].push(PCAdata[i][z]);
            }
          }
        }
      }
      var data_new = [];
      for (var k = 0; k < num_clusters + 1; k += 1) {
        var name = !(k in state.clusterNames)
          ? k === num_clusters
            ? "Admixed Cluster"
            : "Cluster " + k
          : state.clusterNames[k];
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
                size: state.markerSize,
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
                size: state.markerSize,
                symbol: "cross",
                opacity: 0.5,
              },
              text: cluster_texts[k],
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
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
            marker: {
              color: color,
              size: state.markerSize,
              symbol: symbol,
            },
            text: cluster_texts[k],
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}, %{z:.4f}) </i>",
          });
        } else {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            mode: "markers",
            marker: {
              color: color,
              size: state.markerSize,
              symbol: symbol,
            },
            text: cluster_texts[k],
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
          });
        }
      }
    }
    var plot_title = plotTitle;

    if (DIM === 2) {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 20,
          r: 20,
          t: 20,
          b: 20,
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
        autosize: true,
        responsive: true,
      };
    } else {
      layout = {
        margin: {
          l: 20,
          r: 20,
          t: 20,
          b: 20,
        },
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
        autosize: true,
        responsive: true,
      };
    }

    return Plotly.newPlot(scatterRef.current, data_new, layout, updatedLayout, {
      toImageButtonOptions: {
        filename: plotTitle,
        // width: "100%",
        // height: "100%",
        width: picWidth,
        height: picHeight,
        format: picFormat,
      },
    });
  };

  const scatterAdmixFromData = () => {
    let DIMS = [x, y, z]
      .map((dim) => {
        return dim == null ? 0 : 1;
      })
      .reduce((total, curr) => (total = total + curr), 0);

    if (PCAdata == null || DIMS === 0) {
      return Plotly.newPlot(scatterRef.current, updatedLayout, {
        toImageButtonOptions: {
          filename: plotTitle,
          // width: "100%",
          // height: "100%",
          width: picWidth,
          height: picHeight,
          format: picFormat,
        },
      });
    } else {
      if (outlierData.length > 0) {
        return scatterWithClusters(DIMS - 1, x, y, z, true, outlierData);
      } else {
        return scatterWithClusters(DIMS - 1, x, y, z, false, null);
      }
    }
  };

  return <div ref={scatterRef} className="scatter-plot"></div>;
};

ScatterAdmix.propTypes = {
  PCAdata: PropTypes.array,
  AdmixData: PropTypes.array,
  alphaVal: PropTypes.number,
  certaintyVal: PropTypes.number,
  x: PropTypes.string,
  y: PropTypes.string,
  z: PropTypes.string,
  clusterNames: PropTypes.object,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
  plotTitle: PropTypes.string,
  markerSize: PropTypes.number,
  admixMode: PropTypes.number,
  onChange: PropTypes.func,
};

const styles = {
  // ScatterContainer: {
  //   position: "fixed",
  //   zIndex: 1,
  //   top: 0,
  //   overflowX: "hidden",
  //   left: 0,
  //   marginTop: "13%",
  //   marginLeft: "21%",
  //   width: "57%",
  //   height: "74%",
  // },
};

export default ScatterAdmix;
