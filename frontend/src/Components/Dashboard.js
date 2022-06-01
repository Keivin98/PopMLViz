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
import Loader from "react-loader-spinner";
import "react-tabs/style/react-tabs.css";
import AdmixOptions from "./AdmixOptions";
import Navbar from "react-bootstrap/Navbar";


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
];
Chart.register(...registerables);
class App extends Component {
  state = {
    num_clusters: 2,
    ProgressBarType: "Loader",
    ProgressBarTimeInterval: 5,
    columnRange: [1, 10],
    selectedFile: null,
    imageURL: "",
    columns: null,
    data: null,
    distributionData: [],
    pressed: false,
    cluster_names: {},
    alphaVal: 40,
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
    selectedDescribingColumn: { value: "None", label: "None" },
    selectedClusterMethod: null,
    OutlierData: [],
    showOutputOptions: false,
    selectedColorShape: 0,
    admix: [],
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
    // console.log(event.target.files[0]);
  };

  correlationMatrixUpload = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2 style={{}}>File Details:</h2>
          <p>
            File Name:{" "}
            {this.state.selectedFile.name.substr(
              0,
              this.state.selectedFile.name.indexOf(".")
            )}
          </p>
        </div>
      );
    }
  };
  scatter1d = (y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = true;
    var hoverTemplate =
      "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(i);
        y1.push(this.state.data[i][y]);

        if (mapping_id && this.state.data[i]["MappingID2"] == null) {
          mapping_id = false;
          hoverTemplate = "<i>(%{x}, %{y:.4f}) </i>";
        }
        if (mapping_id) {
          cluster_texts.push(this.state.data[i]["MappingID2"]);
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
          marker: { color: randomColors[0] },
        },
      ];
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={{
          title: "1D plot of " + y,
          xaxis: { title: "MappingID2" },
          yaxis: { title: y },
        }}
      />
    );
  };
  scatterCategorical = (DIM, x, y, z, categoricalData) => {
    var cluster_texts = [];
    var uniqueTags = [];
    var layout = {};
    var data_new = [];
    if (categoricalData != null) {
      // find unique values
      for (var catID = 0; catID < categoricalData.length; catID++) {
        if (uniqueTags.indexOf(categoricalData[catID]) === -1) {
          uniqueTags.push(categoricalData[catID]);
        }
      }

      for (var colID = 0; colID < uniqueTags.length; colID++) {
        data_new.push({});
        if (DIM === 2) {
          if (this.state.selectedColorShape === "0") {
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
                size: 4,
              },
              text: "",
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
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
                size: 4,
              },
              text: "",
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
            };
          }
        } else {
          if (this.state.selectedColorShape === "0") {
            data_new[colID] = {
              name: uniqueTags[colID],
              x: [],
              y: [],
              mode: "markers",
              marker: { color: randomColors[colID], symbol: randomShapes[0] },
              text: "",
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
            };
          } else {
            data_new[colID] = {
              name: uniqueTags[colID],
              x: [],
              y: [],
              mode: "markers",
              marker: { color: randomColors[0], symbol: randomShapes[colID] },
              text: "",
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
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
        cluster_texts.push(this.state.data[i][x]);
      }
    }
    for (colID = 0; colID < uniqueTags.length; colID++) {
      data_new.text = cluster_texts;
    }

    var plot_title =
      DIM === 0
        ? "1D plot of " + x
        : DIM === 1
        ? "2D plot of " + x + "and " + y
        : "3D plot of " + x + ", " + y + " and " + z;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        xaxis: { title: "MappingID2" },
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
    }

    return <ScatterPlot data={data_new} layout={layout} />;
  };

  scatterWithClusters(DIM, x, y, z, outliers, distributionData) {
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
        if (outliers && distributionData[i]) {
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
                size: 4,
                symbol: "cross",
                opacity: 0.5,
              },
              text: cluster_texts[k],
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}, %{z:.4f}) </i>",
            });
          } else {
            data_new.push({
              name: "Outliers " + this.state.cluster_names[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              mode: "markers",
              marker: { color: colors[k], symbol: "cross", opacity: 0.5 },
              text: cluster_texts[k],
              hovertemplate: "<i>(%{x:.4f}, %{y:.4f}, %{z:.4f}) </i>",
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
            marker: { color: colors[k], size: 2 },
            text: cluster_texts[k],
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}, %{z:.4f}) </i>",
          });
        } else {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            mode: "markers",
            marker: { color: colors[k] },
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
    return <ScatterPlot data={data_new} layout={layout} />;
  }

  scatterCategoricalandOutliers = (
    DIM,
    x,
    y,
    z,
    categoricalData,
    distributionData,
    outliersOnly
  ) => {
    var cluster_texts = [];
    var uniqueTags = [];
    var layout = {};
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
          // actual data
          data_new.push({
            name: title,
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: { color: otherColor, size: 2 },
            text: "",
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
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
              size: 4,
              symbol: "cross",
              opacity: "0.5",
            },
            text: "",
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
          });
        } else {
          data_new.push({
            name: title,
            x: [],
            y: [],
            mode: "markers",
            marker: { color: otherColor },
            text: "",
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
          });
          data_new.push({
            name: "Outliers " + title,
            x: [],
            y: [],
            mode: "markers",
            marker: { color: outlierColor, symbol: "cross", opacity: "0.5" },
            text: "",
            hovertemplate: "<i>(%{x:.4f}, %{y:.4f}) </i>",
          });
        }
      }
    }

    if (this.state.data != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        var categoryID = uniqueTags.indexOf(categoricalData[i]);
        if (DIM === 0) {
          if (distributionData[i]) {
            data_new[2 * categoryID + 1].x.push(i);
            data_new[2 * categoryID + 1].y.push(this.state.data[i][x]);
          } else {
            data_new[2 * categoryID].x.push(i);
            data_new[2 * categoryID].y.push(this.state.data[i][x]);
          }
        } else if (DIM === 1) {
          if (distributionData[i]) {
            data_new[2 * categoryID + 1].x.push(this.state.data[i][x]);
            data_new[2 * categoryID + 1].y.push(this.state.data[i][y]);
          } else {
            data_new[2 * categoryID].x.push(this.state.data[i][x]);
            data_new[2 * categoryID].y.push(this.state.data[i][y]);
          }
        } else {
          if (distributionData[i]) {
            data_new[2 * categoryID + 1].x.push(this.state.data[i][x]);
            data_new[2 * categoryID + 1].y.push(this.state.data[i][y]);
            data_new[2 * categoryID + 1].z.push(this.state.data[i][z]);
          } else {
            data_new[2 * categoryID].x.push(this.state.data[i][x]);
            data_new[2 * categoryID].y.push(this.state.data[i][y]);
            data_new[2 * categoryID].z.push(this.state.data[i][z]);
          }
        }
        cluster_texts.push(this.state.data[i][x]);
      }
    }
    for (colID = 0; colID < uniqueTags.length; colID++) {
      data_new.text = cluster_texts;
    }

    var plot_title =
      DIM === 0
        ? "1D plot of " + x
        : DIM === 1
        ? "2D plot of " + x + " and " + y
        : "3D plot of " + x + ", " + y + " and " + z;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        xaxis: { title: "MappingID2" },
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
    }

    return <ScatterPlot data={data_new} layout={layout} />;
  };

  scatter2d = (x, y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = true;
    var hoverTemplate =
      "<i>(%{x:.4f}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";

    if (this.state.data != null && x != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        if (mapping_id && this.state.data[i]["MappingID2"] == null) {
          mapping_id = false;
          hoverTemplate = "<i>(%{x}, %{y:.4f} %{z}, %{z:.4f}) </i>";
        }
        if (mapping_id) {
          cluster_texts.push(this.state.data[i]["MappingID2"]);
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
          marker: { color: randomColors[0] },
        },
      ];
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={{
          title: "2D plot of " + x + " and " + y,
          xaxis: { title: x },
          yaxis: { title: y },
        }}
      />
    );
  };

  scatter3d = (x, y, z) => {
    var x1 = [];
    var z1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = true;
    var hoverTemplate =
      "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>" +
      "<br><b>Mapping ID</b>:%{text}</b></br>";
    if (this.state.data != null && x != null && y != null && z != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        z1.push(this.state.data[i][z]);
        if (mapping_id && this.state.data[i]["MappingID2"] == null) {
          mapping_id = false;
          hoverTemplate = "<i>(%{x}, %{y:.4f} %{z}, %{z:.4f}) </i>";
        }
        if (mapping_id) {
          cluster_texts.push(this.state.data[i]["MappingID2"]);
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
          marker: { color: randomColors[0], size: 2 },
        },
      ];
      var layout = {
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
        title: "3D plot of " + x + ", " + y + " and " + z,
      };
    }
    return <ScatterPlot data={data_new} layout={layout} />;
  };

  processData = async (dataString, outliers, admix) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    var selectedUploadOption = this.state.selectedUploadOption;
    var headers = [];
    if (selectedUploadOption === "admixture" || admix === 2) {
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
      if (selectedUploadOption === "admixture" || admix === 2) {
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
      if (admix != null) {
        if (admix === 1) {
          this.setData(list);
          this.setColumns(columns);
        }
        if (admix === 2) {
          this.setAdmix(list);
        }
      } else {
        this.setData(list);
        this.setColumns(columns);
      }
    }
  };

  // handle file upload
  handleFileUpload = (e, admix) => {
    if (this.state.selectedUploadOption === "Correlation Matrix") {
      this.UploadCMDataset(e);
    } else {
      this.setState({ selectedFile: e.target.files[0], isLoading: false });
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
        this.processData(data, false, admix).then(() => {
          if (
            this.state.selectedUploadOption === "PCA" ||
            this.state.selectedUploadOption === "admixture"
          ) {
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
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/uploadCM/`,
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
      });
  };
  runCluster = (s) => {
    if (s.selectedClusterMethod === 0) {
      this.runKmeans(s.num_clusters);
    } 
    if (s.selectedClusterMethod === 1){
      this.runHC(s.num_clusters);
    }
    else {
      this.runFuzzy(s.num_clusters);
    }
  };

  runOutliers = (s) => {
    this.detectOutliers(s.selectedOutlierMethod, s.columnRange, s.pressed);
  };
  runKmeans = (num_clusters) => {
    const formData = {
      df: this.state.data,
      num_clusters: num_clusters,
    };

    this.setState({ isLoading: true, ProgressBarType: "Loader" });

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/runkmeans/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        this.setState({
          isLoading: false,
          clusterColors: r.data,
          cluster_names: cluster_names,
          showOutputOptions: true,
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          num_clusters: num_clusters,
        });
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
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/runhc/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        this.setState({
          isLoading: false,
          clusterColors: r.data,
          cluster_names: cluster_names,
          showOutputOptions: true,
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          num_clusters: num_clusters,
        });
      });
  };

//////////////////////////////////////////////////////////////////
  runFuzzy = (num_clusters) => {
    const formData = {
      df: this.state.data,
      num_clusters: num_clusters,
    };

    this.setState({ isLoading: true, ProgressBarType: "Loader" });

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/runfuzzy/`,
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
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        this.setState({
          isLoading: false,
          clusterColors: r.data,
          cluster_names: cluster_names,
          showOutputOptions: true,
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
          num_clusters: num_clusters,
        });
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
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/cmtsne2d/`,
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
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        this.processData(r.data, false);
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
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/cmtsne3d/`,
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
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        this.processData(r.data, false);
      });
  };
  samplePCADataset = () => {
    this.setState({
      isLoading: true,
      ProgressBarType: "Loader",
    });
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/samplePCA/`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        }
      )
      .then((r) => {
        this.setState({
          isLoading: false,
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        this.processData(r.data, false);
      });
  };

  sampleAdmixDataset = () => {
    this.setState({
      isLoading: true,
      ProgressBarType: "Loader",
    });
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/sampleAdmix/`,
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
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        this.processData(r.data, false, 2);
      });
  };

  samplePCAAdmixDataset = () => {
    this.setState({
      isLoading: true,
      ProgressBarType: "Loader",
    });
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/samplePCAAdmixDataset/`,
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
          distributionData: [],
          selectedDescribingColumn: { value: "None", label: "None" },
        });
        console.log(r.data.admix);
        this.processData(r.data.pca, false, 1);
        this.processData(r.data.admix, false, 2);
      });
  };

  detectOutliers = (selectedOutlierMethod, columnRange, pressed) => {
    if (selectedOutlierMethod === 0) {
      this.setOutlierData([]);
    } else {
      const formData = {
        df: this.state.data,
        method: selectedOutlierMethod,
        columnRange: columnRange,
        combineType: pressed,
      };
      this.setState({ isLoading: true, ProgressBarType: "Loader" });
      axios
        .post(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/detectoutliers/`,
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
          });
          this.processData(r.data, true);
        });
    }
  };

  handleSpecificColumns = (event) => {
    this.setState({
      distributionData:
        event.label === "None"
          ? []
          : this.state.data.map((elem) => elem[event.label]),
      selectedDescribingColumn: event,
      showOutputOptions: false,
      cluster_names: [],
      clusterColors: [],
    });
  };

  showScatterPlot = () => {
    const x = this.state.selectedColumns[0];
    const y = this.state.selectedColumns[1];
    const z = this.state.selectedColumns[2];
    const distributionData = this.state.distributionData;
    const outlierData = this.state.OutlierData;
    const ONE_DIM = 0;
    const TWO_DIM = 1;
    const THREE_DIM = 2;

    if (this.state.selectedUploadOption === "admixture") {
      if (this.state.admix !== undefined) {
        return (
          <BarPlot
            data={this.state.admix}
            alphaVal={this.state.alphaVal}
            clusterNames={{ ...this.state.cluster_names }}
            onChange={this.clusterNumberChange}
          />
        );
      } else {
        return <BarPlot data={[]} />;
      }
    }
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
          outlierData={outlierData}
          x={this.state.selectedColumns[0]}
          y={this.state.selectedColumns[1]}
          z={this.state.selectedColumns[2]}
          clusterNames={this.state.cluster_names}
          onChange={this.clusterNumberChange}
        />
      );
    } else {
      if (
        this.state.selectedColumns[0] === null &&
        this.state.selectedColumns[1] === null &&
        this.state.selectedColumns[2] === null
      ) {
        return <ScatterPlot data={[]} />;
      } else if (
        this.state.selectedColumns[1] === null &&
        this.state.selectedColumns[2] === null
      ) {
        if (
          this.state.clusterColors.length > 0 ||
          distributionData.length > 0 ||
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
            } else if (distributionData.length > 0) {
              return this.scatterCategoricalandOutliers(
                ONE_DIM,
                x,
                null,
                null,
                distributionData,
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
          } else if (distributionData.length > 0) {
            return this.scatterCategorical(
              ONE_DIM,
              x,
              null,
              null,
              distributionData,
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
          distributionData.length > 0 ||
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
            } else if (distributionData.length > 0) {
              return this.scatterCategoricalandOutliers(
                TWO_DIM,
                x,
                y,
                null,
                distributionData,
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
          } else if (distributionData.length > 0) {
            return this.scatterCategorical(TWO_DIM, x, y, z, distributionData);
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
          distributionData.length > 0 ||
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
            } else if (distributionData.length > 0) {
              return this.scatterCategoricalandOutliers(
                THREE_DIM,
                x,
                y,
                z,
                distributionData,
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
          } else if (distributionData.length > 0) {
            return this.scatterCategorical(
              THREE_DIM,
              x,
              y,
              z,
              distributionData
            );
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
    if (
      data.selectedUploadOption === "pcairandadmixture" ||
      data.selectedUploadOption === "admixture"
    ) {
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

  handleTabOutputCallback = (cluster_names) => {
    this.setState({ cluster_names: cluster_names });
  };
  handleAdmixOptionsCallback = (alphaVal) => {
    this.setState({ alphaVal: alphaVal });
  };

  onPressReset = () => {
    this.setState({
      OutlierData: [],
      cluster_names: {},
      clusterColors: [],
      distributionData: [],
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
        <Navbar.Brand style={{ color: "white" }}>
          PopMLViz
          <img
            src="./logo.jpeg"
            style={{ width: "6%", position: "fixed", left: "7%", top: "1%" }}
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
                  accept=".csv,.xlsx,.xls, .txt"
                  disabled={this.state.selectedUploadOption === null}
                  onChange={this.handleFileUpload}
                />
                <Button
                  variant="outlined"
                  style={{
                    backgroundColor: "#ebeff7",
                    marginTop: "2%",
                  }}
                  onClick={this.samplePCADataset}
                >
                  {" "}
                  Load Sample Dataset
                </Button>
              </div>
            )}
            {this.state.selectedUploadOption === "admixture" && (
              <div>
                <input
                  type="file"
                  accept=".Q"
                  disabled={this.state.selectedUploadOption === null}
                  onChange={this.handleAdmixFileUpload2}
                />
                <Button
                  variant="outlined"
                  style={{
                    backgroundColor: "#ebeff7",
                    marginTop: "2%",
                  }}
                  onClick={this.sampleAdmixDataset}
                >
                  {" "}
                  Load Sample Dataset
                </Button>
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
                  />
                </div>
                <div style={styles.littleUpload}>
                  <label style={{ marginRight: "4.5%" }}>Admix</label>
                  <input
                    type="file"
                    accept=".Q"
                    onChange={this.handleAdmixFileUpload2}
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
                  Load Sample Dataset
                </Button>
                {this.state.loading && (
                  <Loader
                    type="TailSpin"
                    color="#00BFFF"
                    height="30"
                    width="30"
                    style={{ marginTop: "2%", marginLeft: "20%" }}
                  />
                )}
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
              accept=".csv,.xlsx,.xls,.Q,.txt"
              disabled={this.state.selectedUploadOption === null}
              onChange={this.handleFileUpload}
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

          <OutlierDetectionTab onChange={this.runOutliers} />

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

        <div
          className="block-example border border-light"
          style={styles.rightPane}
        >
          {this.state.isLoading && (
            <ProgressBarTime
              totalTime={this.state.ProgressBarTimeInterval}
              type={this.state.ProgressBarType}
              isLoading={this.state.isLoading}
            />
          )}
          {!this.state.isLoading && <div>{this.showScatterPlot()}</div>}
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
                    options={this.state.selectActions}
                    onChange={this.handleSelectXChange}
                    isDisabled={this.state.selectedUploadOption === "admixture"}
                  />
                </div>
              </div>

              <div style={styles.dropDown}>
                <label style={{ width: "25%", marginLeft: "12%" }}>
                  <h6 style={{}}> Y-axis </h6>
                </label>
                <div style={{ width: "75%" }}>
                  <Select
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

                        {this.state.multiValue.length > 0 && (
                          <div style={styles.describingColumnDropDown}>
                            <label style={{ marginLeft: "1%" }}>
                              <h6
                                style={{
                                  width: "100%",
                                  marginTop: "3%",
                                  marginLeft: "1%",
                                }}
                              >
                                Choose Describing Column
                              </h6>
                            </label>
                            <div>
                              <Select
                                value={this.state.selectedDescribingColumn}
                                options={this.state.multiValue}
                                onChange={this.handleSpecificColumns}
                              />
                            </div>
                            <FormControl
                              style={{ marginLeft: "2%", marginTop: "2%" }}
                            >
                              <FormLabel id="describingColumn-row-radio-buttons-group-label">
                                Identify by:{" "}
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="describingColumn-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={this.onValueChangeColorShape}
                                style={{ marginLeft: "2%", marginTop: "2%" }}
                              >
                                <FormControlLabel
                                  value={0}
                                  control={
                                    <Radio color="success" size="small" />
                                  }
                                  label="Color"
                                />
                                <FormControlLabel
                                  value={1}
                                  control={
                                    <Radio color="success" size="small" />
                                  }
                                  label="Shape"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          width: "90%",
                          marginTop: "3%",
                          marginLeft: "3%",
                        }}
                      >
                        <label>
                          {" "}
                          <h5 style={{}}> Describing Columns </h5>
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

                      {this.state.data !== null && (
                        <DownloadData
                          data={this.state.data}
                          clusterColors={this.state.clusterColors}
                          OutlierData={this.state.OutlierData}
                          clusterNames={this.state.cluster_names}
                        />
                      )}
                    </TabPanel>
                    <TabPanel style={styles.outputSettings}>
                      {" "}
                      {this.state.showOutputOptions && (
                        <TabOutputOptions
                          uniqueClusters={this.state.num_clusters}
                          parentCallback={this.handleTabOutputCallback}
                        />
                      )}
                    </TabPanel>{" "}
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
                        initialVal={40}
                        name={
                          this.state.selectedUploadOption ===
                          "pcairandadmixture"
                            ? "Alpha"
                            : "Certainty"
                        }
                        description={
                          this.state.selectedUploadOption ===
                          "pcairandadmixture"
                            ? "NOTE: If the admixture result for the entity is less than the chosen alpha, the entity will be marked as Undefined!"
                            : "NOTE: If the difference between the top two admixture results for the entity is less than the chosen certainty, the entity will be marked as Undefined!"
                        }
                        parentCallback={this.handleAdmixOptionsCallback}
                      />
                    </div>
                    {this.state.data !== null && (
                      <DownloadData
                        data={this.state.data}
                        clusterColors={this.state.clusterColors}
                        OutlierData={this.state.OutlierData}
                        columnRange={this.state.columnRange}
                        clusterNames={this.state.cluster_names}
                      />
                    )}
                  </TabPanel>
                  <TabPanel style={styles.outputSettings}>
                    {this.state.showOutputOptions && (
                      <TabOutputOptions
                        uniqueClusters={this.state.num_clusters}
                        parentCallback={this.handleTabOutputCallback}
                      />
                    )}
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
    height: "90%",
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    top: 0,
    right: 0,
    width: "75%",
    marginTop: "5%",
    marginRight: "10px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  radioButtons: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  },
  dimensions: {
    position: "fixed",
    z_index: 1,
    top: "11%",
    overflow_x: "hidden",
    left: 0,
    marginLeft: "26%",
    width: "52%",
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
    width: "23%",
    marginLeft: "2%",
  },
  describingColumnDropDown: {
    width: "90%",
    marginLeft: "3%",
  },
  optionsContainer: {
    position: "fixed",
    right: "1%",
    top: -10,
    height: "86%",
    display: "flex",
    flexDirection: "column",
    width: "20%",
    padding: "10px",
    marginTop: "6.5%",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
  },
  littleUpload: {
    display: "flex",
    flexDirection: "row",
    padding: "2px",
  },
};
export default App;
