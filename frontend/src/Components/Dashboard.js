import axios from "axios";
import React, { Component } from "react";
import { Chart, registerables } from "chart.js";
import * as XLSX from "xlsx";
import Select from "react-select";
import ScatterPlot from "./ScatterPlot";
import BarPlot from "./BarPlot";
import UploadAndVisualizeTab from "./UploadAndVisualizeTab";
import DimensionalityReductionTab from "./DimensionalityReductionTab";
import ScatterAdmix from "./ScatterAdmix";
import DownloadData from "./DownloadData";
import ClusteringAlgorithmsTab from "./ClusteringAlgorithmsTab";
import OutlierDetectionTab from "./OutlierDetectionTab";
import ProgressBarTime from "./ProgressBarTime";
import { Button } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import TabOutputOptions from "./TabOutputOptions";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import "react-tabs/style/react-tabs.css";
import AdmixOptions from "./AdmixOptions";
import Navbar from "react-bootstrap/Navbar";
import Dendrogram from "./Dendrogram";

require("dotenv").config();
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

const randomShapes = [
  "circle",
  "square",
  "diamond",
  "x",
  "star",
  "triangle-up",
  "bowtie",
  "pentagon",
  "hexagon",
  "star-diamond",
  "circle-cross",
  "hash",
  "y-up",
  "line-ew",
  "arrow-down",
];

Chart.register(...registerables);
class App extends Component {
  state = {
    num_clusters: 2,
    ProgressBarType: "Loader",
    ProgressBarTimeInterval: 5,
    columnRange: [],
    selectedFile: null,
    imageURL: "",
    columns: null,
    data: null,
    coloredData: [],
    shapedData: [],
    pressed: false,
    cluster_names: {},
    alphaVal: 40,
    certaintyVal: 40,
    allActions: [],
    selectActions: [],
    selectedColumns: [null, null, null],
    selectedOption: null,
    selectedUploadOption: null,
    isLoading: false,
    clusterColors: [],
    show: true,
    multiValue: [],
    describingValues: [],
    selectedDescribingColumnColor: { value: "None", label: "None" },
    selectedDescribingColumnShape: { value: "None", label: "None" },
    sampleDatasets: [
      { value: 0, label: "1000 Genomes Project (1KG)" },
      { value: 1, label: "Human Genome Diversity Project (HGDP)" },
    ],
    sampleDatasetValue: 0,
    selectedClusterMethod: null,
    OutlierData: [],
    showOutputOptions: false,
    selectedColorShape: 0,
    admix: [],
    AdmixOptionsLabelCheck: true,
    plotTitle: "",
    mappingIDColumn: "",
    picHeight: 600,
    picWidth: 800,
    picFormat: "png",
    metaData: [],
    metaDataColumns: [],
    dendrogramPath: "",
    markerSize: 4,
    admixMode: 0,
  };
  handleMultiChange = (option) => {
    let act = [];
    for (var i = 0; i < this.state.columns.length; i++) {
      act.push({
        value: this.state.columns[i]["name"].toLowerCase(),
        label: this.state.columns[i]["name"],
      });
    }
    this.setState({
      multiValue: [{ value: "None", label: "None" }, ...option],
      selectActions: act.filter((elem) => {
        return option.indexOf(elem) < 0;
      }),
    });
  };

  setColumns = (columns) => {
    let act = [];
    for (var i = 0; i < columns.length; i++) {
      act.push({
        value: columns[i]["name"].toLowerCase(),
        label: columns[i]["name"],
      });
    }
    this.setState({ columns: columns, selectActions: act, allActions: act });
  };

  setData = (data) => {
    this.setState({ data: data });
  };
  setAdmix = (data) => {
    this.setState({ admix: data });
  };
  setMetaData = (data) => {
    this.setState({ metaData: data });
  };
  setMetaDataColumns = (columns) => {
    let act = [];
    for (var i = 0; i < columns.length; i++) {
      act.push({
        value: columns[i]["name"].toLowerCase(),
        label: columns[i]["name"],
      });
    }
    this.setState({
      metaDataColumns: columns,
      selectActions: [...this.state.selectActions, act],
      allActions: [...this.state.allActions, act],
    });
  };

  setOutlierData = (data) => {
    this.setState({
      OutlierData: data.map((elem) => {
        return parseInt(elem[0], 10);
      }),
    });
  };
  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  scatter1d = (y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = this.state.mappingIDColumn !== "";

    var hoverTemplate =
      this.state.mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}) </i>"
        : // eslint-disable-next-line
          "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(i);
        y1.push(this.state.data[i][y]);

        if (mapping_id) {
          cluster_texts.push(this.state.data[i][this.state.mappingIDColumn]);
        }
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          mode: "markers",
          text: cluster_texts,
          hovertemplate: hoverTemplate,
          marker: { color: randomColors[0], size: this.state.markerSize },
        },
      ];
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={{
          title: this.state.plotTitle,
          yaxis: { title: y },
        }}
        picWidth={Number(this.state.picWidth)}
        picHeight={Number(this.state.picHeight)}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  };
  scatterCategorical = (DIM, x, y, z, categoricalData, colorOrShape) => {
    if (this.state.selectedColorShape === 2) {
      return this.scatterCategorical2(DIM, x, y, z);
    }
    var uniqueTags = [];
    var layout = {};
    var data_new = [];
    var mapping_id = this.state.mappingIDColumn !== "";

    var hoverTemplate2D =
      this.state.mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}) </i>"
        : // eslint-disable-next-line
          "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";

    var hoverTemplate3D =
      this.state.mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}, %{z:.4f}) </i>"
        : // eslint-disable-next-line
          "<i>(%{x}, %{y:.4f}), %{z:.4f}) </i>" +
          "<br><b>Mapping ID</b>:%{text}</b></br>";

    if (categoricalData != null) {
      // find unique values
      for (var catID = 0; catID < categoricalData.length; catID++) {
        if (uniqueTags.indexOf(categoricalData[catID]) === -1) {
          uniqueTags.push(categoricalData[catID]);
        }
      }
      if (uniqueTags.length > 20) {
        alert("There are too many unique values! Check the categorical data!");
        if (colorOrShape === 0) {
          this.setState({
            coloredData: [],
            selectedDescribingColumnColor: null,
          });
        } else {
          this.setState({
            coloredData: [],
            selectedDescribingColumnShape: null,
          });
        }

        return;
      }

      for (var colID = 0; colID < uniqueTags.length; colID++) {
        data_new.push({});

        if (DIM === 2) {
          if (this.state.selectedColorShape === 0) {
            data_new[colID] = {
              name: uniqueTags[colID],
              x: [],
              y: [],
              z: [],
              type: "scatter3d",
              mode: "markers",
              marker: {
                color: randomColors[colID],
                symbol: randomShapes[0],
                size: this.state.markerSize,
              },
              text: [],
              hovertemplate: hoverTemplate3D,
            };
          } else {
            data_new[colID] = {
              name: uniqueTags[colID],
              x: [],
              y: [],
              z: [],
              type: "scatter3d",
              mode: "markers",
              marker: {
                color: randomColors[0],
                symbol: randomShapes[colID],
                size: this.state.markerSize,
              },
              text: [],
              hovertemplate: hoverTemplate3D,
            };
          }
        } else {
          if (this.state.selectedColorShape === 0) {
            data_new[colID] = {
              name: uniqueTags[colID],
              x: [],
              y: [],
              mode: "markers",
              marker: {
                color: randomColors[colID],
                symbol: randomShapes[0],
                size: this.state.markerSize,
              },
              text: [],
              hovertemplate: hoverTemplate2D,
            };
          } else {
            data_new[colID] = {
              name: uniqueTags[colID],
              x: [],
              y: [],
              mode: "markers",
              marker: {
                color: randomColors[0],
                symbol: randomShapes[colID],
                size: this.state.markerSize,
              },
              text: [],
              hovertemplate: hoverTemplate2D,
            };
          }
        }
      }
    }

    if (this.state.data != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        var categoryID = uniqueTags.indexOf(categoricalData[i]);
        if (DIM === 0) {
          data_new[categoryID].x.push(i);
          data_new[categoryID].y.push(this.state.data[i][x]);
        } else if (DIM === 1) {
          data_new[categoryID].x.push(this.state.data[i][x]);
          data_new[categoryID].y.push(this.state.data[i][y]);
        } else {
          data_new[categoryID].x.push(this.state.data[i][x]);
          data_new[categoryID].y.push(this.state.data[i][y]);
          data_new[categoryID].z.push(this.state.data[i][z]);
        }
        if (mapping_id) {
          data_new[categoryID].text.push(
            this.state.data[i][this.state.mappingIDColumn]
          );
        }
      }
    }
    var plot_title = this.state.plotTitle;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        xaxis: { title: "ID" },
        yaxis: { title: y },
      };
    } else if (DIM === 1) {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    } else {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
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
    }

    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={this.state.picWidth}
        picHeight={this.state.picHeight}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  };

  scatterCategorical2 = (DIM, x, y, z) => {
    var uniqueTags1 = [];
    var uniqueTags2 = [];
    var layout = {};
    var data_new = [];
    var mapping_id = this.state.mappingIDColumn !== "";
    var hoverTemplate2D =
      this.state.mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}) </i>"
        : // eslint-disable-next-line
          "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    var hoverTemplate3D =
      this.state.mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}, %{z:.4f}) </i>"
        : // eslint-disable-next-line
          "<i>(%{x}, %{y:.4f}), %{z:.4f}) </i>" +
          "<br><b>Mapping ID</b>:%{text}</b></br>";

    // find unique values
    for (var catID = 0; catID < this.state.coloredData.length; catID++) {
      if (uniqueTags1.indexOf(this.state.coloredData[catID]) === -1) {
        uniqueTags1.push(this.state.coloredData[catID]);
      }
    }
    for (catID = 0; catID < this.state.shapedData.length; catID++) {
      if (uniqueTags2.indexOf(this.state.shapedData[catID]) === -1) {
        uniqueTags2.push(this.state.shapedData[catID]);
      }
    }
    if (uniqueTags1.length > 20 || uniqueTags2.length > 20) {
      alert("There are too many unique values! Check the categorical data!");
      this.setState({
        coloredData: [],
        selectedDescribingColumn: null,
      });
      return;
    }

    for (var colID1 = 0; colID1 < uniqueTags1.length; colID1++) {
      for (var colID2 = 0; colID2 < uniqueTags2.length; colID2++) {
        data_new.push({});
        var colID = colID1 * uniqueTags2.length + colID2;
        if (DIM === 2) {
          data_new[colID] = {
            name: uniqueTags1[colID1] + " " + uniqueTags2[colID2],
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: {
              color: randomColors[colID1],
              symbol: randomShapes[colID2],
              size: this.state.markerSize,
            },
            text: [],
            hovertemplate: hoverTemplate3D,
          };
        } else {
          data_new[colID] = {
            name: uniqueTags1[colID1] + " " + uniqueTags2[colID2],
            x: [],
            y: [],
            mode: "markers",
            marker: {
              color: randomColors[colID1],
              symbol: randomShapes[colID2],
              size: this.state.markerSize,
            },
            text: [],
            hovertemplate: hoverTemplate2D,
          };
        }
      }
    }
    if (this.state.data != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        var categoryID1 = uniqueTags1.indexOf(this.state.coloredData[i]);
        var categoryID2 = uniqueTags2.indexOf(this.state.shapedData[i]);

        var categoryID = categoryID1 * uniqueTags2.length + categoryID2;
        console.log(
          categoryID1,
          categoryID2,
          uniqueTags2,
          this.state.shapedData[i],
          categoryID,
          data_new.length
        );
        if (DIM === 0) {
          data_new[categoryID].x.push(i);
          data_new[categoryID].y.push(this.state.data[i][x]);
        } else if (DIM === 1) {
          data_new[categoryID].x.push(this.state.data[i][x]);
          data_new[categoryID].y.push(this.state.data[i][y]);
        } else {
          data_new[categoryID].x.push(this.state.data[i][x]);
          data_new[categoryID].y.push(this.state.data[i][y]);
          data_new[categoryID].z.push(this.state.data[i][z]);
        }
        if (mapping_id) {
          data_new[categoryID].text.push(
            this.state.data[i][this.state.mappingIDColumn]
          );
        }
      }
    }
    var plot_title = this.state.plotTitle;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        xaxis: { title: "ID" },
        yaxis: { title: y },
      };
    } else if (DIM === 1) {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    } else {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
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
    }

    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={this.state.picWidth}
        picHeight={this.state.picHeight}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  };
  scatterWithClusters(DIM, x, y, z, outliers, coloredData) {
    var x_clusters = [];
    var y_clusters = [];
    var layout = {};
    var hoverTemplate = "";
    var mapping_id = false;
    if (DIM === 2) {
      var z_clusters = [];
      mapping_id = this.state.mappingIDColumn !== "";
      // eslint-disable-next-line
      hoverTemplate =
        this.state.mappingIDColumn === ""
          ? "<i>(%{x:.4f}, %{y:.4f} %{z:.4f}) </i>"
          : "<i>(%{x:.4f}, %{y:.4f} %{z:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>";
    } else {
      mapping_id = this.state.mappingIDColumn !== "";
      // eslint-disable-next-line
      hoverTemplate =
        this.state.mappingIDColumn === ""
          ? "<i>(%{x:.4f}, %{y:.4f}) </i>"
          : "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>";
    }
    var cluster_texts = [];

    if (outliers) {
      var x_clusters_outliers = [];
      var y_clusters_outliers = [];
      if (DIM === 2) {
        var z_clusters_outliers = [];
      }
    }
    for (var num_cl = 0; num_cl < this.state.num_clusters; num_cl++) {
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

    for (let j = 0; j < this.state.num_clusters; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.state.data != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        let rowCol = this.state.clusterColors[i];
        if (outliers && coloredData[i]) {
          if (DIM === 0) {
            x_clusters_outliers[rowCol].push(i);
            y_clusters_outliers[rowCol].push(this.state.data[i][x]);
          } else if (DIM === 1) {
            x_clusters_outliers[rowCol].push(this.state.data[i][x]);
            y_clusters_outliers[rowCol].push(this.state.data[i][y]);
          } else {
            x_clusters_outliers[rowCol].push(this.state.data[i][x]);
            y_clusters_outliers[rowCol].push(this.state.data[i][y]);
            z_clusters_outliers[rowCol].push(this.state.data[i][z]);
          }
        } else {
          if (DIM === 0) {
            x_clusters[rowCol].push(i);
            y_clusters[rowCol].push(this.state.data[i][x]);
          } else if (DIM === 1) {
            x_clusters[rowCol].push(this.state.data[i][x]);
            y_clusters[rowCol].push(this.state.data[i][y]);
          } else {
            x_clusters[rowCol].push(this.state.data[i][x]);
            y_clusters[rowCol].push(this.state.data[i][y]);
            z_clusters[rowCol].push(this.state.data[i][z]);
          }
        }
        if (mapping_id) {
          cluster_texts[rowCol].push(
            this.state.data[i][this.state.mappingIDColumn]
          );
        }
      }
      var data_new = [];
      for (var k = 0; k < this.state.num_clusters; k += 1) {
        if (outliers) {
          if (DIM === 2) {
            data_new.push({
              name: "Outliers " + this.state.cluster_names[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              z: z_clusters_outliers[k],
              mode: "markers",
              type: "scatter3d",
              marker: {
                color: colors[k],
                size: this.state.markerSize,
                symbol: "cross",
                opacity: 0.5,
              },
              text: cluster_texts[k],
              hovertemplate: hoverTemplate,
            });
          } else {
            data_new.push({
              name: "Outliers " + this.state.cluster_names[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              mode: "markers",
              marker: {
                color: colors[k],
                symbol: "cross",
                opacity: 0.5,
                size: this.state.markerSize,
              },
              text: cluster_texts[k],
              hovertemplate: hoverTemplate,
            });
          }
        }
        var name = isNaN(this.state.cluster_names[k])
          ? this.state.cluster_names[k]
          : "Cluster " + this.state.cluster_names[k];
        if (DIM === 2) {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            z: z_clusters[k],
            mode: "markers",
            type: "scatter3d",
            marker: { color: colors[k], size: this.state.markerSize },
            text: cluster_texts[k],
            hovertemplate: hoverTemplate,
          });
        } else {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            mode: "markers",
            marker: { color: colors[k], size: this.state.markerSize },
            text: cluster_texts[k],
            hovertemplate: hoverTemplate,
          });
        }
      }
    }
    var plot_title = this.state.plotTitle;

    if (DIM === 2) {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
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
    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={this.state.picWidth}
        picHeight={this.state.picHeight}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  }

  scatterCategoricalandOutliers = (
    DIM,
    x,
    y,
    z,
    categoricalData,
    coloredData,
    outliersOnly
  ) => {
    var cluster_texts = [];
    var uniqueTags = [];
    var layout = {};
    var mapping_id = this.state.mappingIDColumn !== "";
    var hoverTemplate = "";
    if (categoricalData != null) {
      // find unique values
      for (var catID = 0; catID < categoricalData.length; catID++) {
        if (uniqueTags.indexOf(categoricalData[catID]) === -1) {
          uniqueTags.push(categoricalData[catID]);
        }
      }
      var data_new = [];
      for (var colID = 0; colID < uniqueTags.length; colID++) {
        var outlierColor = outliersOnly ? "grey" : randomColors[colID];
        var otherColor = outliersOnly ? randomColors[0] : randomColors[colID];
        var title = outliersOnly ? "0" : uniqueTags[colID];

        if (DIM === 2) {
          // eslint-disable-next-line
          hoverTemplate = !mapping_id
            ? "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>"
            : "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>" +
              "<br><b>Mapping ID</b>:%{text}</b></br>";
          // actual data
          data_new.push({
            name: title,
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: { color: otherColor, size: this.state.markerSize },
            text: [],
            hovertemplate: hoverTemplate,
          });
          // outliers
          data_new.push({
            name: "Outliers " + title,
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: {
              color: outlierColor,
              size: this.state.markerSize,
              symbol: "cross",
              opacity: "0.5",
            },
            text: [],
            hovertemplate: hoverTemplate,
          });
        } else {
          // eslint-disable-next-line
          hoverTemplate = !mapping_id
            ? "<i>(%{x:.4f}, %{y:.4f}</i>"
            : "<i>(%{x:.4f}, %{y:.4f}</i>" +
              "<br><b>Mapping ID</b>:%{text}</b></br>";
          data_new.push({
            name: title,
            x: [],
            y: [],
            mode: "markers",
            marker: { color: otherColor, size: this.state.markerSize },
            text: [],
            hovertemplate: hoverTemplate,
          });
          data_new.push({
            name: "Outliers " + title,
            x: [],
            y: [],
            mode: "markers",
            marker: {
              color: outlierColor,
              symbol: "cross",
              opacity: "0.5",
              size: this.state.markerSize,
            },
            text: [],
            hovertemplate: hoverTemplate,
          });
        }
        cluster_texts.push([]);
        cluster_texts.push([]);
      }
    }

    if (this.state.data != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        var categoryID = uniqueTags.indexOf(categoricalData[i]);
        if (DIM === 0) {
          if (coloredData[i]) {
            data_new[2 * categoryID + 1].x.push(i);
            data_new[2 * categoryID + 1].y.push(this.state.data[i][x]);
            if (mapping_id) {
              data_new[2 * categoryID + 1].text.push(
                this.state.data[i][this.state.mappingIDColumn]
              );
            }
          } else {
            data_new[2 * categoryID].x.push(i);
            data_new[2 * categoryID].y.push(this.state.data[i][x]);
            if (mapping_id) {
              data_new[2 * categoryID].text.push(
                this.state.data[i][this.state.mappingIDColumn]
              );
            }
          }
        } else if (DIM === 1) {
          if (coloredData[i]) {
            data_new[2 * categoryID + 1].x.push(this.state.data[i][x]);
            data_new[2 * categoryID + 1].y.push(this.state.data[i][y]);
            if (mapping_id) {
              data_new[2 * categoryID + 1].text.push(
                this.state.data[i][this.state.mappingIDColumn]
              );
            }
          } else {
            data_new[2 * categoryID].x.push(this.state.data[i][x]);
            data_new[2 * categoryID].y.push(this.state.data[i][y]);
            if (mapping_id) {
              data_new[2 * categoryID].text.push(
                this.state.data[i][this.state.mappingIDColumn]
              );
            }
          }
        } else {
          if (coloredData[i]) {
            data_new[2 * categoryID + 1].x.push(this.state.data[i][x]);
            data_new[2 * categoryID + 1].y.push(this.state.data[i][y]);
            data_new[2 * categoryID + 1].z.push(this.state.data[i][z]);
            if (mapping_id) {
              data_new[2 * categoryID + 1].text.push(
                this.state.data[i][this.state.mappingIDColumn]
              );
            }
          } else {
            data_new[2 * categoryID].x.push(this.state.data[i][x]);
            data_new[2 * categoryID].y.push(this.state.data[i][y]);
            data_new[2 * categoryID].z.push(this.state.data[i][z]);
            if (mapping_id) {
              data_new[2 * categoryID].text.push(
                this.state.data[i][this.state.mappingIDColumn]
              );
            }
          }
        }
      }
    }

    var plot_title = this.state.plotTitle;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        yaxis: { title: y },
      };
    } else if (DIM === 1) {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    } else {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
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
    }

    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={this.state.picWidth}
        picHeight={this.state.picHeight}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  };

  scatter2d = (x, y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = this.state.mappingIDColumn !== "";

    var hoverTemplate = !mapping_id
      ? "<i>(%{x}, %{y:.4f}) </i>"
      : // eslint-disable-next-line
        "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";

    if (this.state.data != null && x != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        if (mapping_id) {
          cluster_texts.push(this.state.data[i][this.state.mappingIDColumn]);
        }
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          mode: "markers",
          text: cluster_texts,
          hovertemplate: hoverTemplate,
          marker: { color: randomColors[0], size: this.state.markerSize },
        },
      ];
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={{
          title: this.state.plotTitle,
          xaxis: { title: x },
          yaxis: { title: y },
        }}
        picWidth={this.state.picWidth}
        picHeight={this.state.picHeight}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  };

  scatter3d = (x, y, z) => {
    var x1 = [];
    var z1 = [];
    var y1 = [];
    var cluster_texts = [];

    var mapping_id = this.state.mappingIDColumn !== "";
    // eslint-disable-next-line
    var hoverTemplate = !mapping_id
      ? "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>"
      : "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>" +
        "<br><b>Mapping ID</b>:%{text}</b></br>";
    if (this.state.data != null && x != null && y != null && z != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        z1.push(this.state.data[i][z]);
        if (mapping_id) {
          cluster_texts.push(this.state.data[i][this.state.mappingIDColumn]);
        }
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          z: z1,
          mode: "markers",
          type: "scatter3d",
          text: cluster_texts,
          hovertemplate: hoverTemplate,
          marker: { color: randomColors[0], size: this.state.markerSize },
        },
      ];
      var layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
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
        title: this.state.plotTitle,
      };
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={this.state.picWidth}
        picHeight={this.state.picHeight}
        picFormat={this.state.picFormat}
        plotTitle={this.state.plotTitle}
      />
    );
  };

  processData = async (dataString, outliers, type) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    var selectedUploadOption = this.state.selectedUploadOption;
    var headers = [];
    if (selectedUploadOption === "typeture" || type === 2) {
      headers = [...Array(dataStringLines[0].split(" ").length)].map(
        (x, index) => {
          return "v" + (index + 1);
        }
      );
    } else {
      var headersCommaDelim = dataStringLines[0].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      var headersSpaceDelim = dataStringLines[0].split(" ");
      if (headersCommaDelim.length > headersSpaceDelim.length) {
        headers = headersCommaDelim;
      } else {
        headers = headersSpaceDelim;
      }
    }
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      var row = [];
      if (selectedUploadOption === "typeture" || type === 2) {
        row = dataStringLines[i - 1].split(" ");
      } else {
        var rowCommaDelim = dataStringLines[i].split(
          /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
        );
        var rowSpaceDelim = dataStringLines[i].split(" ");
        if (rowCommaDelim.length > rowSpaceDelim.length) {
          row = rowCommaDelim;
        } else {
          row = rowSpaceDelim;
        }
      }
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    if (outliers === true) {
      this.setOutlierData(list);
    } else {
      if (type != null) {
        if (type === 1) {
          this.setData(list);
          this.setColumns(columns);
        }
        if (type === 2) {
          this.setAdmix(list);
        }
        if (type === 3) {
          this.setMetaData(list);
          this.setMetaDataColumns(columns);
        }
      } else {
        this.setData(list);
        this.setColumns(columns);
      }
    }
  };

  mergeDataWithMetaData = () => {
    if (this.state.data.length !== this.state.metaData.length) {
      alert(
        "The dimensions do not match! Only the available metadata will be matched."
      );
    }
    var mergedData = this.state.data.map((elem, index) => {
      var ID = elem["IID"];
      var result = this.state.metaData.filter((elem) => {
        return elem["IID"] === ID;
      });
      if (result.length > 0) {
        var { IID, ...extraData } = result[0];
        // console.log(result[0], extraData);
        return Object.assign({}, elem, extraData);
      } else {
        var columns = Object.keys(this.state.metaData[0]);
        var no_match = {};
        for (var i = 0; i < columns.length; i++) {
          if (columns[i] !== "IID") {
            no_match[columns[i]] = "No match";
          }
        }

        return Object.assign({}, elem, no_match);
      }
    });
    const uniqueIds = [];
    const mergedColumns = [
      ...this.state.columns,
      ...this.state.metaDataColumns,
    ];
    const mergedColumnsFiltered = mergedColumns.filter((element) => {
      const isDuplicate = uniqueIds.includes(element.name);

      if (!isDuplicate) {
        uniqueIds.push(element.name);
        return true;
      }

      return false;
    });

    this.setColumns(mergedColumnsFiltered);
    this.setState({ data: mergedData, metaData: [] });
  };

  //  handle file upload
  //  e is the file information
  //  type is the type of the file :
  //  1 for handleAdmixFileUpload1
  //  2 for handleAdmixFileUpload2
  //  3 for metadata
  handleFileUpload = (e, type) => {
    if (this.state.selectedUploadOption === "Correlation Matrix") {
      this.UploadCMDataset(e);
    } else {
      this.setState({
        selectedFile: e.target.files[0],
        isLoading: false,
        outlierData: [],
        coloredData: [],
        clusterNames: [],
        clusterColors: [],
      });
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        this.processData(data, false, type).then(() => {
          if (type === 3) {
            return this.mergeDataWithMetaData();
          }
          if (this.state.selectedUploadOption === "PCA") {
          } else if (this.state.selectedUploadOption === "t-SNE 2D") {
            this.runTSNE2d();
          } else if (this.state.selectedUploadOption === "t-SNE 3D") {
            this.runTSNE3d();
          }
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  handleAdmixFileUpload1 = (e) => {
    this.handleFileUpload(e, 1);
  };

  handleAdmixFileUpload2 = (e) => {
    this.handleFileUpload(e, 2);
  };
  handleMetaDataUpload = (e) => {
    this.handleFileUpload(e, 3);
  };
  handleSampleDataset = (option) => {
    this.setState({
      sampleDatasetValue: option.value,
    });
  };
  handleSelectXChange = (value) => {
    this.setState({
      selectedColumns: [
        value.label,
        this.state.selectedColumns[1],
        this.state.selectedColumns[2],
      ],
    });
  };

  handleSelectYChange = (value) => {
    this.setState({
      selectedColumns: [
        this.state.selectedColumns[0],
        value.label,
        this.state.selectedColumns[2],
      ],
    });
  };
  handleSelectZChange = (value) => {
    this.setState({
      selectedColumns: [
        this.state.selectedColumns[0],
        this.state.selectedColumns[1],
        value.label,
      ],
    });
  };

  onUploadValueChange = (event) => {
    this.setState({
      selectedUploadOption: event.target.value,
    });
  };

  onValueChangeDims = (event) => {
    var value = event.target.value;
    var newSelected = [];
    if (value === "1D") {
      newSelected = [this.state.selectedColumns[0], null, null];
      this.setState({
        selectedOption: event.target.value,
        selectedColumns: newSelected,
      });
    } else if (value === "2D") {
      newSelected = this.state.selectedColumns;
      newSelected[2] = null;
      this.setState({
        selectedOption: event.target.value,
        selectedColumns: newSelected,
      });
    } else {
      this.setState({
        selectedOption: value,
      });
    }
  };

  onValueChangeColorShape = (event) => {
    this.setState({
      selectedColorShape: event.target.value,
    });
    this.showScatterPlot();
  };

  formSubmit = (event) => {
    event.preventDefault();
  };

  UploadCMDataset = (e) => {
    this.setState({
      isLoading: true,
      ProgressBarType: "ProgressBar",
      ProgressBarTimeInterval: 150,
    });
    // Create an object of formData
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("filename", e.target.value);
    this.setState({
      loading: true,
    });

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadCM/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        this.setState({ isLoading: false, selectedUploadOption: "PCA" });
        this.processData(response.data, false);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };
  runCluster = (s) => {
    if (s.selectedClusterMethod === 0) {
      this.runKmeans(s.num_clusters);
    } else if (s.selectedClusterMethod === 1) {
      this.runHC(s.num_clusters);
    } else {
      this.runFuzzy(s.num_clusters);
    }
  };

  runOutliers = (s) => {
    const inputFormat = this.state.selectedUploadOption.includes("t-SNE")
      ? "tsne"
      : "pca";
    this.detectOutliers(
      s.selectedOutlierMethod,
      s.columnRange,
      s.pressed,
      inputFormat
    );
  };

  removeOutliers = () => {
    this.setState({ OutlierData: [] });
  };

  runKmeans = (num_clusters) => {
    const formData = {
      df: this.state.data,
      num_clusters: num_clusters,
    };

    this.setState({
      isLoading: true,
      ProgressBarType: "Loader",
      admix: [],
      selectedUploadOption: "PCA",
    });

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runkmeans/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        // eslint-disable-next-line
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        this.setState({
          isLoading: false,
          clusterColors: r.data,
          cluster_names: cluster_names,
          showOutputOptions: true,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          num_clusters: num_clusters,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };
  //////////////////////////////////////////////////////////////////
  //Hierarchical clustering code:Naffy

  runHC = (num_clusters) => {
    const formData = {
      df: this.state.data,
      num_clusters: num_clusters,
    };

    this.setState({ isLoading: true, ProgressBarType: "Loader" });

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runhc/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        // eslint-disable-next-line
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        this.setState({
          isLoading: false,
          clusterColors: r.data.result,
          dendrogramPath: r.data.filename,
          cluster_names: cluster_names,
          showOutputOptions: true,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          num_clusters: num_clusters,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert("Network error! Please check the request or try again.");
      });
  };

  //////////////////////////////////////////////////////////////////

  runFuzzy = (num_clusters) => {
    const formData = {
      df: this.state.data,
      num_clusters: num_clusters,
      admix: [],
      selectedUploadOption: "PCA",
    };

    this.setState({ isLoading: true, ProgressBarType: "Loader" });

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runfuzzy/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        // eslint-disable-next-line
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        this.setState({
          isLoading: false,
          clusterColors: r.data,
          cluster_names: cluster_names,
          showOutputOptions: true,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          num_clusters: num_clusters,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };

  runTSNE2d = () => {
    const formData = {
      df: this.state.data,
    };
    this.setState({
      isLoading: true,
      ProgressBarType: "ProgressBar",
      ProgressBarTimeInterval: 70,
    });
    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/cmtsne2d/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        this.setState({
          isLoading: false,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          OutlierData: [],
          cluster_names: {},
          clusterColors: [],
        });
        this.processData(r.data, false);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };
  runTSNE3d = () => {
    const formData = {
      df: this.state.data,
    };
    this.setState({
      isLoading: true,
      ProgressBarType: "ProgressBar",
      ProgressBarTimeInterval: 70,
    });
    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/cmtsne3d/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        this.setState({
          isLoading: false,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          OutlierData: [],
          cluster_names: {},
          clusterColors: [],
        });
        this.processData(r.data, false);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };
  samplePCADataset = () => {
    this.setState({
      isLoading: true,
      ProgressBarType: "Loader",
      OutlierData: [],
      cluster_names: {},
      clusterColors: [],
      coloredData: [],
      dendrogramPath: "",
    });
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/samplePCA/${this.state.sampleDatasetValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        this.setState({
          isLoading: false,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        this.processData(r.data, false);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };

  samplePCAAdmixDataset = () => {
    this.setState({
      isLoading: true,
      ProgressBarType: "Loader",
      OutlierData: [],
      cluster_names: {},
      clusterColors: [],
      dendrogramPath: "",
    });
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/samplePCAAdmixDataset/${this.state.sampleDatasetValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        this.setState({
          isLoading: false,
          coloredData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        this.processData(r.data.pca, false, 1);
        this.processData(r.data.admix, false, 2);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert(
          "Server error! Please check the input and try again. If the error persists, refer to the docs! "
        );
      });
  };

  detectOutliers = (
    selectedOutlierMethod,
    columnRange,
    pressed,
    inputFormat
  ) => {
    if (selectedOutlierMethod === 0) {
      this.setOutlierData([]);
    } else {
      const formData = {
        df: this.state.data,
        method: selectedOutlierMethod,
        columnRange: columnRange,
        combineType: pressed,
        inputFormat: inputFormat,
      };
      this.setState({ isLoading: true, ProgressBarType: "Loader" });
      axios
        .post(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/detectoutliers/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((r) => {
          this.setState({
            isLoading: false,
            selectedUploadOption: this.state.selectedUploadOption.includes(
              "t-SNE"
            )
              ? "PCA"
              : this.state.selectedUploadOption,
            selectedColorShape: 0, // keep it always to zero, because we do not need the shaped data
          });
          this.processData(r.data, true);
        })
        .catch((e) => {
          this.setState({
            isLoading: false,
          });
          console.log(e);
          alert(
            "Server error! Please check the input and try again. If the error persists, refer to the docs! "
          );
        });
    }
  };

  handleColoredColumns = (event) => {
    this.setState({
      coloredData:
        event.label === "None"
          ? []
          : this.state.data.map((elem) => elem[event.label]),
      selectedDescribingColumnColor: event,
      selectedDescribingColumnShape:
        this.state.selectedDescribingColumnShape.value === event.value
          ? { value: "None", label: "None" }
          : this.state.selectedDescribingColumnShape,
      showOutputOptions: false,
      selectedColorShape:
        this.state.selectedDescribingColumnShape.value === event.value ||
        this.state.selectedDescribingColumnShape.value === "None"
          ? 0 //only color
          : 2, //both shape and color
      cluster_names: [],
      clusterColors: [],
    });
    this.showScatterPlot();
  };

  handleShapeColumns = (event) => {
    this.setState({
      shapedData:
        event.label === "None"
          ? []
          : this.state.data.map((elem) => elem[event.label]),
      coloredData:
        this.state.selectedDescribingColumnColor === event
          ? []
          : this.state.coloredData,
      selectedDescribingColumnShape: event,
      selectedDescribingColumnColor:
        this.state.selectedDescribingColumnColor.value === event.value
          ? { value: "None", label: "None" }
          : this.state.selectedDescribingColumnColor,
      showOutputOptions: false,
      selectedColorShape:
        this.state.selectedDescribingColumnColor.value === event.value ||
        this.state.selectedDescribingColumnColor.value === "None"
          ? 1 //only shape
          : 2, //both shape and color
      cluster_names: [],
      clusterColors: [],
      OutlierData: [],
    });
    this.showScatterPlot();
  };

  showScatterPlot = () => {
    const x = this.state.selectedColumns[0];
    const y = this.state.selectedColumns[1];
    const z = this.state.selectedColumns[2];
    var categoricalData = [];
    if (this.state.selectedColorShape === 0) {
      categoricalData = this.state.coloredData;
    } else {
      categoricalData = this.state.shapedData;
    }
    const outlierData = this.state.OutlierData;
    const ONE_DIM = 0;
    const TWO_DIM = 1;
    const THREE_DIM = 2;

    if (
      this.state.selectedUploadOption === "pcairandadmixture" &&
      this.state.data != null &&
      this.state.admix.length > 0
    ) {
      return (
        <ScatterAdmix
          PCAdata={this.state.data}
          AdmixData={this.state.admix}
          alphaVal={this.state.alphaVal}
          certaintyVal={this.state.certaintyVal}
          outlierData={outlierData}
          x={this.state.selectedColumns[0]}
          y={this.state.selectedColumns[1]}
          z={this.state.selectedColumns[2]}
          clusterNames={this.state.cluster_names}
          onChange={this.clusterNumberChange}
          plotTitle={this.state.plotTitle}
          picWidth={Number(this.state.picWidth)}
          picHeight={Number(this.state.picHeight)}
          picFormat={this.state.picFormat}
          markerSize={this.state.markerSize}
          admixMode={this.state.admixMode}
        />
      );
    } else {
      if (
        this.state.selectedColumns[0] === null &&
        this.state.selectedColumns[1] === null &&
        this.state.selectedColumns[2] === null
      ) {
        return (
          <ScatterPlot
            data={[]}
            picWidth={this.state.picWidth}
            picHeight={this.state.picHeight}
            picFormat={this.state.picFormat}
            plotTitle={this.state.plotTitle}
          />
        );
      } else if (
        this.state.selectedColumns[1] === null &&
        this.state.selectedColumns[2] === null
      ) {
        if (
          this.state.clusterColors.length > 0 ||
          categoricalData.length > 0 ||
          outlierData.length > 0
        ) {
          if (outlierData.length > 0) {
            if (this.state.clusterColors.length > 0) {
              return this.scatterWithClusters(
                ONE_DIM,
                x,
                null,
                null,
                true,
                outlierData
              );
            } else if (categoricalData.length > 0) {
              return this.scatterCategoricalandOutliers(
                ONE_DIM,
                x,
                null,
                null,
                categoricalData,
                outlierData,
                false
              );
            } else {
              return this.scatterCategoricalandOutliers(
                ONE_DIM,
                x,
                null,
                null,
                outlierData,
                outlierData,
                true
              );
            }
          } else if (categoricalData.length > 0) {
            return this.scatterCategorical(
              ONE_DIM,
              x,
              null,
              null,
              categoricalData,
              false
            );
          } else {
            return this.scatterWithClusters(ONE_DIM, x, null, null, false);
          }
        } else {
          return this.scatter1d(x);
        }
      } else if (this.state.selectedColumns[2] === null) {
        if (
          this.state.clusterColors.length > 0 ||
          categoricalData.length > 0 ||
          outlierData.length > 0
        ) {
          if (outlierData.length > 0) {
            if (this.state.clusterColors.length > 0) {
              return this.scatterWithClusters(
                TWO_DIM,
                x,
                y,
                null,
                true,
                outlierData
              );
            } else if (categoricalData.length > 0) {
              return this.scatterCategoricalandOutliers(
                TWO_DIM,
                x,
                y,
                null,
                categoricalData,
                outlierData,
                false
              );
            } else {
              return this.scatterCategoricalandOutliers(
                TWO_DIM,
                x,
                y,
                null,
                outlierData,
                outlierData,
                true
              );
            }
          } else if (categoricalData.length > 0) {
            return this.scatterCategorical(TWO_DIM, x, y, z, categoricalData);
          } else {
            return this.scatterWithClusters(
              TWO_DIM,
              x,
              y,
              null,
              false,
              null,
              null
            );
          }
        } else {
          return this.scatter2d(x, y);
        }
      } else {
        if (
          this.state.clusterColors.length > 0 ||
          categoricalData.length > 0 ||
          outlierData.length > 0
        ) {
          if (outlierData.length > 0) {
            if (this.state.clusterColors.length > 0) {
              return this.scatterWithClusters(
                THREE_DIM,
                x,
                y,
                z,
                true,
                outlierData
              );
            } else if (categoricalData.length > 0) {
              return this.scatterCategoricalandOutliers(
                THREE_DIM,
                x,
                y,
                z,
                categoricalData,
                outlierData,
                false
              );
            } else {
              return this.scatterCategoricalandOutliers(
                THREE_DIM,
                x,
                y,
                z,
                outlierData,
                outlierData,
                true
              );
            }
          } else if (categoricalData.length > 0) {
            return this.scatterCategorical(THREE_DIM, x, y, z, categoricalData);
          } else {
            return this.scatterWithClusters(
              THREE_DIM,
              x,
              y,
              z,
              false,
              null,
              null
            );
          }
        } else {
          return this.scatter3d(x, y, z);
        }
      }
    }
  };
  onInputMetadataClick = (event) => {
    event.target.value = "";
    event.target.label = "";
  };
  DRTabChange = (data) => {
    this.setState({
      selectedUploadOption: data.selectedUploadOption,
      isLoading: data.isLoading,
      ProgressBarType: data.ProgressBarType,
      ProgressBarTimeInterval: data.ProgressBarTimeInterval,
    });
  };

  clusterNumberChange = (data) => {
    this.setState({ num_clusters: data.numClusters });
  };
  UploadTabChange = (data) => {
    if (data.selectedUploadOption === "pcairandadmixture") {
      this.setState({
        selectedUploadOption: data.selectedUploadOption,
        showOutputOptions: true,
      });
    } else {
      this.setState({
        selectedUploadOption: data.selectedUploadOption,
      });
    }
  };

  handleTabOutputCallback = (outputState) => {
    this.setState({
      cluster_names: outputState.cluster_names,
      plotTitle: outputState.plotTitle,
      picWidth: outputState.width,
      picHeight: outputState.height,
      picFormat: outputState.selectedColumn,
      markerSize:
        outputState.markerSize === undefined
          ? this.state.markerSize
          : outputState.markerSize,
    });
  };
  handleAdmixOptionsCallback = (state) => {
    this.setState({
      alphaVal: state.initialAlpha,
      certaintyVal: state.initialCertainty,
      admixMode: state.mode === "Alpha" ? 0 : 1,
    });
  };

  onPressReset = () => {
    this.setState({
      num_clusters: 2,
      ProgressBarType: "Loader",
      columnRange: [],
      selectedFile: null,
      imageURL: "",
      columns: null,
      data: null,
      coloredData: [],
      pressed: false,
      cluster_names: {},
      alphaVal: 40,
      allActions: [],
      selectActions: [],
      selectedColumns: [null, null, null],
      selectedOption: null,
      isLoading: false,
      clusterColors: [],
      show: true,
      multiValue: [],
      describingValues: [],
      selectedDescribingColumn: { value: "None", label: "None" },
      selectedClusterMethod: null,
      OutlierData: [],
      showOutputOptions: false,
      selectedColorShape: 0,
      admix: [],
      AdmixOptionsLabelCheck: true,
      plotTitle: "",
      mappingIDColumn: "",
      picHeight: 600,
      picWidth: 800,
      picFormat: "png",
      metaData: [],
      metaDataColumns: [],
    });
  };

  render() {
    return (
      <div>
        <Navbar
          style={{
            position: "fixed",
            height: "6%",
            width: "100%",
            paddingLeft: "45%",
            backgroundColor: "#3b3f4e",
          }}
        >
          <Navbar.Brand style={{ color: "white", fontSize: 24 }}>
            PopMLViz
            <img
              src="./logo.jpeg"
              style={{ width: "6%", position: "fixed", left: "7%", top: "1%" }}
              alt=""
            />
          </Navbar.Brand>
        </Navbar>

        <div style={styles.splitScreen}>
          <div class="leftpane" style={styles.leftPane}>
            <form style={{ marginTop: "1%" }}>
              <UploadAndVisualizeTab onChange={this.UploadTabChange} />

              {this.state.selectedUploadOption === "PCA" && (
                <div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.txt"
                    disabled={this.state.selectedUploadOption === null}
                    onChange={this.handleFileUpload}
                    onClick={this.onInputMetadataClick}
                  />
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        color: "black",
                        width: "50%",
                        marginTop: 10,
                        marginRight: 10,
                      }}
                    >
                      <Select
                        value={
                          this.state.sampleDatasets[
                            this.state.sampleDatasetValue
                          ]
                        }
                        options={this.state.sampleDatasets}
                        onChange={this.handleSampleDataset}
                      />
                    </div>
                    <Button
                      variant="outlined"
                      style={{
                        backgroundColor: "#ebeff7",
                        marginTop: "2%",
                      }}
                      onClick={this.samplePCADataset}
                    >
                      {" "}
                      Load Data
                    </Button>
                  </div>
                </div>
              )}
              {this.state.selectedUploadOption === "pcairandadmixture" && (
                <div
                  style={{
                    width: "200%",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  <div style={styles.littleUpload}>
                    <label style={{ marginRight: "3%" }}>PCA</label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.txt"
                      onChange={this.handleAdmixFileUpload1}
                      onClick={this.onInputMetadataClick}
                    />
                  </div>
                  <div style={styles.littleUpload}>
                    <label style={{ marginRight: "4.5%" }}>Admix</label>
                    <input
                      type="file"
                      accept=".Q"
                      onChange={this.handleAdmixFileUpload2}
                      onClick={this.onInputMetadataClick}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        color: "black",
                        width: "25%",
                        marginTop: 10,
                        marginRight: 10,
                      }}
                    >
                      <Select
                        value={
                          this.state.sampleDatasets[
                            this.state.sampleDatasetValue
                          ]
                        }
                        options={this.state.sampleDatasets}
                        onChange={this.handleSampleDataset}
                      />
                    </div>
                    <Button
                      variant="outlined"
                      style={{
                        backgroundColor: "#ebeff7",
                        marginTop: "2%",
                      }}
                      onClick={this.samplePCAAdmixDataset}
                    >
                      {" "}
                      Load Data
                    </Button>
                  </div>
                </div>
              )}
            </form>
            <hr
              style={{
                backgroundColor: "white",
                height: 3,
                opacity: 1,
              }}
            />
            <DimensionalityReductionTab
              onChange={this.DRTabChange}
              processData={this.processData}
            />
            {(this.state.selectedUploadOption === "Correlation Matrix" ||
              this.state.selectedUploadOption === "t-SNE 2D" ||
              this.state.selectedUploadOption === "t-SNE 3D") && (
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.Q,.txt,.pkl"
                disabled={this.state.selectedUploadOption === null}
                onChange={this.handleFileUpload}
                onClick={this.onInputMetadataClick}
              />
            )}
            <hr
              style={{
                backgroundColor: "white",
                height: 3,
                opacity: 1,
              }}
            />
            <ClusteringAlgorithmsTab onChange={this.runCluster} />

            <hr
              style={{
                backgroundColor: "white",
                height: 3,
                opacity: 1,
              }}
            />

            <OutlierDetectionTab
              onChange={this.runOutliers}
              numFeatures={
                this.state.allActions.filter((elem) => {
                  return (
                    Array.isArray(elem) ||
                    elem.label.includes("PC") ||
                    elem.label.includes("TSNE")
                  );
                }).length
              }
              allActions={this.state.allActions}
              removeOutliers={this.removeOutliers}
            />

            <div style={{ marginTop: "20%" }}>
              <Button
                variant="outlined"
                style={{
                  color: "red",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  backgroundColor: "#ebeff7",
                  marginLeft: "32%",
                }}
                onClick={this.onPressReset}
              >
                RESET
              </Button>
            </div>
          </div>

          <div className="block-example" style={styles.rightPane}>
            {this.state.isLoading && (
              <ProgressBarTime
                totalTime={this.state.ProgressBarTimeInterval}
                type={this.state.ProgressBarType}
                isLoading={this.state.isLoading}
              />
            )}
            {!this.state.isLoading && (
              <div>
                <Tabs style={styles.dendrogramTabs}>
                  <TabList>
                    <Tab>Scatter Plot</Tab>
                    {this.state.dendrogramPath !== "" && <Tab>Dendrogram</Tab>}
                    {this.state.admix.length > 0 &&
                      this.state.selectedUploadOption ===
                        "pcairandadmixture" && <Tab>Admixture</Tab>}
                  </TabList>
                  <TabPanel>{this.showScatterPlot()}</TabPanel>
                  {this.state.dendrogramPath !== "" && (
                    <TabPanel>
                      <Dendrogram dendrogramPath={this.state.dendrogramPath} />
                    </TabPanel>
                  )}
                  <TabPanel>
                    <BarPlot
                      data={this.state.admix}
                      alphaVal={this.state.alphaVal}
                      certaintyVal={this.state.certaintyVal}
                      clusterNames={{ ...this.state.cluster_names }}
                      onChange={this.clusterNumberChange}
                      AdmixOptionsLabelCheck={this.state.AdmixOptionsLabelCheck}
                      plotTitle={this.state.plotTitle}
                      picWidth={Number(this.state.picWidth)}
                      picHeight={Number(this.state.picHeight)}
                      picFormat={this.state.picFormat}
                      admixMode={this.state.admixMode}
                    />
                  </TabPanel>
                </Tabs>
              </div>
            )}
            <div>
              <div className="radio" style={styles.dimensions}>
                <FormControl style={{ marginLeft: "2%", marginTop: "1%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Plot
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={this.state.selectedOption}
                    onChange={this.onValueChangeDims}
                  >
                    <FormControlLabel
                      value="1D"
                      disabled={this.state.selectedUploadOption === "admixture"}
                      control={<Radio color="success" size="small" />}
                      label="1D"
                    />
                    <FormControlLabel
                      value="2D"
                      disabled={this.state.selectedUploadOption === "admixture"}
                      control={<Radio color="success" size="small" />}
                      label="2D"
                    />
                    <FormControlLabel
                      value="3D"
                      disabled={this.state.selectedUploadOption === "admixture"}
                      control={<Radio color="success" size="small" />}
                      label="3D"
                    />
                  </RadioGroup>
                </FormControl>
                <div style={styles.dropDown}>
                  <label style={{ width: "25%", marginLeft: "12%" }}>
                    <h6 style={{}}> X-axis </h6>
                  </label>
                  <div style={{ width: "75%" }}>
                    <Select
                      value={{
                        value:
                          this.state.selectedColumns[0] == null
                            ? "None"
                            : this.state.selectedColumns[0],
                        label:
                          this.state.selectedColumns[0] == null
                            ? "None"
                            : this.state.selectedColumns[0],
                      }}
                      options={this.state.selectActions}
                      onChange={this.handleSelectXChange}
                      isDisabled={
                        this.state.selectedUploadOption === "admixture"
                      }
                    />
                  </div>
                </div>

                <div style={styles.dropDown}>
                  <label style={{ width: "25%", marginLeft: "12%" }}>
                    <h6 style={{}}> Y-axis </h6>
                  </label>
                  <div style={{ width: "75%" }}>
                    <Select
                      value={{
                        value:
                          this.state.selectedColumns[1] == null
                            ? "None"
                            : this.state.selectedColumns[1],
                        label:
                          this.state.selectedColumns[1] == null
                            ? "None"
                            : this.state.selectedColumns[1],
                      }}
                      options={this.state.selectActions}
                      onChange={this.handleSelectYChange}
                      isDisabled={
                        (this.state.selectedOption !== "3D" &&
                          this.state.selectedOption !== "2D") ||
                        this.state.selectedUploadOption === "admixture"
                      }
                    />
                  </div>
                </div>
                <div style={styles.dropDown}>
                  <label style={{ width: "25%", marginLeft: "12%" }}>
                    <h6 style={{}}> Z-axis </h6>
                  </label>
                  <div style={{ width: "75%" }}>
                    <Select
                      value={{
                        value:
                          this.state.selectedColumns[2] == null
                            ? "None"
                            : this.state.selectedColumns[2],
                        label:
                          this.state.selectedColumns[2] == null
                            ? "None"
                            : this.state.selectedColumns[2],
                      }}
                      options={this.state.selectActions}
                      onChange={this.handleSelectZChange}
                      isDisabled={
                        this.state.selectedOption !== "3D" ||
                        this.state.selectedUploadOption === "admixture"
                      }
                    />
                  </div>
                </div>
              </div>
              <Tabs style={styles.optionsContainer}>
                <TabList>
                  <Tab>Settings</Tab>
                  <Tab>Output Options</Tab>
                </TabList>
                {this.state.selectedUploadOption !== "admixture" &&
                  this.state.selectedUploadOption !== "pcairandadmixture" && (
                    <div>
                      {" "}
                      <TabPanel>
                        <div className="row">
                          <div className="row-md-8"></div>
                          <div
                            style={{
                              width: "90%",
                              marginTop: "3%",
                              marginLeft: "3%",
                            }}
                          >
                            <label
                              style={{
                                fontWeight: "300",
                                fontSize: 18,
                                padding: "2%",
                              }}
                            >
                              Describing Columns
                            </label>
                            <Select
                              name="filters"
                              placeholder="Filters"
                              value={this.state.multiValue.filter((elem) => {
                                return elem.label !== "None";
                              })}
                              options={this.state.selectActions}
                              onChange={this.handleMultiChange}
                              isMulti
                            />
                          </div>
                          {this.state.multiValue.length > 0 && (
                            <div>
                              <div style={styles.describingColumnDropDown}>
                                <label
                                  style={{
                                    fontSize: 14,
                                    padding: "2%",
                                    width: "30%",
                                  }}
                                >
                                  Identify by Colors
                                </label>
                                <div style={{ width: "62%", marginTop: "1%" }}>
                                  <Select
                                    value={
                                      this.state.selectedDescribingColumnColor
                                    }
                                    options={this.state.multiValue}
                                    onChange={this.handleColoredColumns}
                                  />
                                </div>
                              </div>
                              <div style={styles.describingColumnDropDown}>
                                <label
                                  style={{
                                    fontSize: 14,
                                    padding: "2%",
                                    width: "30%",
                                  }}
                                >
                                  Identify by Shape
                                </label>
                                <div style={{ width: "62%", marginTop: "1%" }}>
                                  <Select
                                    value={
                                      this.state.selectedDescribingColumnShape
                                    }
                                    disabled={this.state.OutlierData.length > 0}
                                    options={this.state.multiValue}
                                    onChange={this.handleShapeColumns}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            width: "90%",
                            marginTop: "10%",
                            marginLeft: "3%",
                          }}
                        >
                          <label
                            style={{
                              fontWeight: "300",
                              fontSize: 18,
                              padding: "2%",
                            }}
                          >
                            Mapping ID Column
                          </label>
                          <Select
                            placeholder="Mapping ID"
                            options={this.state.allActions}
                            onChange={(option) => {
                              this.setState({ mappingIDColumn: option.label });
                            }}
                          />
                          <label
                            style={{
                              fontWeight: "300",
                              padding: "2%",
                              fontSize: 18,
                              marginTop: "10%",
                            }}
                          >
                            Add Metadata
                            <input
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              onChange={this.handleMetaDataUpload}
                              onClick={this.onInputMetadataClick}
                              disabled={
                                this.state.data == null ||
                                this.state.data.length === 0
                              }
                            />
                          </label>
                        </div>
                        {this.state.data !== null && (
                          <DownloadData
                            data={this.state.data}
                            clusterColors={this.state.clusterColors}
                            OutlierData={this.state.OutlierData}
                            clusterNames={this.state.cluster_names}
                            admixData={this.state.admix}
                            alphaVal={this.state.alphaVal}
                            certaintyVal={this.state.certaintyVal}
                            admixMode={this.state.admixMode}
                          />
                        )}
                      </TabPanel>
                      <TabPanel style={styles.outputSettings}>
                        <TabOutputOptions
                          uniqueClusters={this.state.num_clusters}
                          parentCallback={this.handleTabOutputCallback}
                          showClusters={this.state.showOutputOptions}
                          markerSize={this.state.markerSize}
                        />
                      </TabPanel>
                    </div>
                  )}
                {(this.state.selectedUploadOption === "pcairandadmixture" ||
                  this.state.selectedUploadOption === "admixture") && (
                  <div>
                    <TabPanel>
                      <div
                        style={{
                          width: "90%",
                          marginLeft: "3%",
                        }}
                      >
                        <AdmixOptions
                          initialAlpha={this.state.alphaVal}
                          initialCertainty={this.state.certaintyVal}
                          name={
                            this.state.selectedUploadOption ===
                            "pcairandadmixture"
                              ? "Alpha"
                              : "Certainty"
                          }
                          parentCallback={this.handleAdmixOptionsCallback}
                          mode={this.state.admixMode}
                          disabled={this.state.admix.length === 0}
                        />
                      </div>
                      {this.state.data !== null && (
                        <DownloadData
                          data={this.state.data}
                          clusterColors={this.state.clusterColors}
                          OutlierData={this.state.OutlierData}
                          columnRange={this.state.columnRange}
                          clusterNames={this.state.cluster_names}
                          admixData={this.state.admix}
                          alphaVal={this.state.alphaVal}
                          certaintyVal={this.state.certaintyVal}
                          admixMode={this.state.admixMode}
                        />
                      )}
                    </TabPanel>
                    <TabPanel style={styles.outputSettings}>
                      <TabOutputOptions
                        uniqueClusters={this.state.num_clusters}
                        parentCallback={this.handleTabOutputCallback}
                        showClusters={this.state.showOutputOptions}
                        markerSize={this.state.markerSize}
                      />
                    </TabPanel>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  splitScreen: {
    display: "flex",
    flexDirection: "column",
  },
  leftPane: {
    height: "130%",
    position: "absolute",
    top: 0,
    overflow_x: "hidden",
    padding_top: "20px",
    left: 0,
    width: "20%",
    marginTop: "3%",
    color: "white",
    padding: "2%",
    backgroundColor: "#3b3f4e",
  },
  rightPane: {
    height: "91%",
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    top: 0,
    right: 0,
    width: "78%",
    marginTop: "4%",
    marginRight: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtons: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  },
  dimensions: {
    position: "fixed",
    z_index: 1,
    top: "8%",
    overflow_x: "hidden",
    left: 0,
    marginLeft: "21%",
    width: "57%",
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
  },
  outputSettings: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  dropDown: {
    width: "21%",
    marginLeft: "2%",
  },
  describingColumnDropDown: {
    marginLeft: "3%",
    display: "flex",
    flexDirection: "row",
    marginTop: "2%",
  },
  optionsContainer: {
    position: "fixed",
    right: "1%",
    top: 0,
    height: "89%",
    display: "flex",
    flexDirection: "column",
    width: "20%",
    padding: "10px",
    marginTop: "4.5%",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
  },
  dendrogramTabs: {
    position: "fixed",
    top: 0,
    left: 0,
    marginTop: "10%",
    marginLeft: "21%",
    width: "52%",
  },
  littleUpload: {
    display: "flex",
    flexDirection: "row",
    padding: "2px",
  },
};
export default App;
