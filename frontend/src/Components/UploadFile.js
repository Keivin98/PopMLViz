import axios from "axios";
import React, { Component } from "react";
import { Chart, registerables } from "chart.js";
import * as XLSX from "xlsx";
import Select from "react-select";
import Plot from "react-plotly.js";
import Loader from "react-loader-spinner";
import ScatterPlot from "./ScatterPlot";
import Incrementor from "./Incrementor";
import DownloadData from "./DownloadData";
import OutlierBlock from "./OutlierBlock";
import { Button } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabOutputOptions from "./TabOutputOptions"
import 'react-tabs/style/react-tabs.css';

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
var selectedOutlierMethod = null;
Chart.register(...registerables);
var num_clusters = 2;


class App extends Component {
  state = {
    // Initially, no file is selected
    columnRange : [1, 10],
    selectedFile: null,
    uplaodType: null,
    imageURL: "",
    columns: null,
    data: null,
    distributionData: [],
    pressed: -1,
    cluster_names: {},
    DRAlgorithm: "",
    DRActions: [
      {
        label: "PCA",
        value: "PCA",
      },
      {
        label: "t-SNE 2D",
        value: "tsne1",
      },
      {
        label: "t-SNE 3D",
        value: "tsne2",
      },
    ],
    selectOutlierActions: [
      {
        label: "None",
        value: "method0",
      },
      {
        label: "1std",
        value: "method1",
      },
      {
        label: "2std",
        value: "method2",
      },
      {
        label: "3std",
        value: "method3",
      },
    ],
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
    identifierColumn: "",
    selectedOutlierMethod: null,
    OutlierData: [],
    

  };
  handleMultiChange = (option) => {
    console.log(option);
    this.setState({
      multiValue: [{ value: "None", label: "None" }, ...option],
      selectActions: this.state.selectActions.filter((elem) => {
        return option.indexOf(elem) < 0;
      }),
    });
  };
  handleOutlierChange = (option) => {
    selectedOutlierMethod = option.label;
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
  setOutlierData = (data) => {
    this.setState({ OutlierData: data });
  };
  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    // console.log(event.target.files[0]);
  };

  // File content to be displayed after
  // file upload is complete
  correlationMatrixUpload = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>
            File Name:{" "}
            {this.state.selectedFile.name.substr(
              0,
              this.state.selectedFile.name.indexOf(".")
            )}
          </p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            {" "}
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Upload the Dataset</h4>
        </div>
      );
    }
  };
  scatter1d = (y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(i);
        y1.push(this.state.data[i][y]);
        cluster_texts.push(this.state.data[i]["MappingID2"]);
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          mode: "markers",
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
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
  scatter1dCategorical = (y, distributionData, categoricalData, outliers) => {

    var cluster_texts = [];
    var uniqueTags = [];
    if (distributionData != null) {
      // find unique values
      for (var catID = 0; catID < categoricalData.length; catID ++){
          if (uniqueTags.indexOf(categoricalData[catID]) === -1) {
              uniqueTags.push(categoricalData[catID])
          };
        }
      var data_new = [];
      for (var colID = 0; colID < uniqueTags.length; colID ++){
        data_new.push({
          name: uniqueTags[colID],
          x: [],
          y: [],
          mode: "markers",
          marker: { color: randomColors[colID] },
          text: "",
          hovertemplate:
            "<i>(%{x}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        });
      }
    }
    // console.log(distributionData);
    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        var categoryID = uniqueTags.indexOf(categoricalData[i]);
        (data_new[categoryID].x).push(i); 
        (data_new[categoryID].y).push(this.state.data[i][y]);
        cluster_texts.push(this.state.data[i]["PC1"]);
      }
    }
    for (colID = 0; colID < uniqueTags.length; colID ++){
      data_new.text = cluster_texts;
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
  scatter1dWithColumns = (y, distributionData, outliers) => {
    var x1 = [];
    var x2 = [];
    var y1 = [];
    var y2 = [];
    var cluster_texts = [];
    let colors = [];
    if (
      distributionData != null &&
      distributionData.filter((elem) => {
        return elem !== 0 && elem !== 1;
      }).length === 0
    ) {
      // this a boolean data, color everything true or false
      // choose the two representing colors
      colors = [randomColors[0], randomColors[1]];
    }
    // console.log(distributionData);
    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        if (distributionData[i] === 0) {
          x1.push(i);
          y1.push(this.state.data[i][y]);
          cluster_texts.push(this.state.data[i]["MappingID2"]);
        } else {
          x2.push(i);
          y2.push(this.state.data[i][y]);
          cluster_texts.push(this.state.data[i]["MappingID2"]);
        }
      }
      var marker_shape = outliers ? "cross" : "circle";
      var marker_color = outliers ? "#c9d6d3" : colors[1];
      var data1_name = outliers ? "Data" : "True";
      var data2_name = outliers ? "Outliers" : "False";
      var data_new = [
        {
          name: data1_name,
          x: x1,
          y: y1,
          mode: "markers",
          marker: { color: colors[0] },
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        },
        {
          name: data2_name,
          x: x2,
          y: y2,
          mode: "markers",
          marker: { color: marker_color, symbol: marker_shape },

          text: cluster_texts,
          hovertemplate:
            "<i>(%{x}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        },
      ];
    }

    // console.log("before scatter");
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
  scatterWithClusters(DIM, x, y, z,  outliers, distributionData) {
    var x_clusters = [];
    var y_clusters = [];
    var layout = {};
    if (DIM === 2){
      var z_clusters = [];
    }
    var cluster_texts = [];

    if(outliers){
      var x_clusters_outliers = [];
      var y_clusters_outliers = [];
      if (DIM === 2){
        var z_clusters_outliers = [];
      }
    }
    for (var num_cl = 0; num_cl < num_clusters; num_cl++) {
      x_clusters.push([]);
      y_clusters.push([]);
      if (DIM === 2){
        z_clusters.push([]);
      }
      if(outliers){
        x_clusters_outliers.push([]);
        y_clusters_outliers.push([]);
        if (DIM === 2){
          z_clusters_outliers.push([]);
        }
      }
      cluster_texts.push([]);
    }

    var colors = [];

    for (let j = 0; j < num_clusters; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.state.data != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        let rowCol = this.state.clusterColors[i];
        if (outliers && distributionData[i]){
          if (DIM === 0){
            x_clusters_outliers[rowCol].push(i);  
            y_clusters_outliers[rowCol].push(this.state.data[i][x]);
          }else if (DIM === 1){
            x_clusters_outliers[rowCol].push(this.state.data[i][x]);
            y_clusters_outliers[rowCol].push(this.state.data[i][y]);
          }else{
            x_clusters_outliers[rowCol].push(this.state.data[i][x]);
            y_clusters_outliers[rowCol].push(this.state.data[i][y]);
            z_clusters_outliers[rowCol].push(this.state.data[i][z]);
          }

        }
        else{
          if (DIM === 0){
            x_clusters[rowCol].push(i);  
            y_clusters[rowCol].push(this.state.data[i][x]);
          }else if (DIM === 1){
            x_clusters[rowCol].push(this.state.data[i][x]);
            y_clusters[rowCol].push(this.state.data[i][y]);
          }else{
            x_clusters[rowCol].push(this.state.data[i][x]);
            y_clusters[rowCol].push(this.state.data[i][y]);
            z_clusters[rowCol].push(this.state.data[i][z]);
          }
        }
      }
      var data_new = [];
      for (var k = 0; k < num_clusters; k += 1) {
        if(outliers){
          if(DIM === 2){
            data_new.push({
              name: "Outliers " + this.state.cluster_names[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              z: z_clusters_outliers[k],
              mode: "markers",
              type: "scatter3d",
              marker: { color: colors[k],  size: 4, symbol: 'cross', opacity:0.5},
              text: cluster_texts[k],
            });
          }else{
            data_new.push({
              name: "Outliers " + this.state.cluster_names[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              mode: "markers",
              marker: { color: colors[k], symbol: 'cross', opacity:0.5},
              text: cluster_texts[k],
            });
          }
        }
        var name = isNaN(this.state.cluster_names[k]) ? this.state.cluster_names[k] : "Cluster " + this.state.cluster_names[k]
        if(DIM === 2){
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            z: z_clusters[k],
            mode: "markers",
            type: "scatter3d",
            marker: { color: colors[k],  size: 4},
            text: cluster_texts[k],
          });
        }else{
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            mode: "markers",
            marker: { color: colors[k] },
            text: cluster_texts[k],
          });
        }
      }
    }
    var plot_title = (DIM === 0 ? "1D plot of " + x 
                    : DIM === 1 ? "2D plot of " + x + " and " + y 
                    :             "3D plot of " + x + " and " + y + " and " + z )
    
    if (DIM === 2){
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
      }else{
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
      />
    );
  }
  
  scatter2d = (x, y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    if (this.state.data != null && x != null && y != null) {
      // console.log(x, y);
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        cluster_texts.push(this.state.data[i]["MappingID2"]);
      }
      // console.log(cluster_texts);
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          mode: "markers",
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
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
  scatter2dCategorical = (x, y, distributionData, categoricalData, outliers) => {

    var cluster_texts = [];
    var uniqueTags = [];
    if (distributionData != null) {
      // find unique values
      for (var catID = 0; catID < categoricalData.length; catID ++){
          if (uniqueTags.indexOf(categoricalData[catID]) === -1) {
              uniqueTags.push(categoricalData[catID])
          };
        }
        console.log("hey", uniqueTags)
      var data_new = [];
      for (var colID = 0; colID < uniqueTags.length; colID ++){
        data_new.push({
          name: uniqueTags[colID],
          x: [],
          y: [],
          mode: "markers",
          marker: { color: randomColors[colID] },
          text: "",
          hovertemplate:
            "<i>(%{x}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        });
      }
    }
    // console.log(distributionData);
    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        var categoryID = uniqueTags.indexOf(categoricalData[i]);
        // console.log("yo", categoryID);
        (data_new[categoryID].x).push(this.state.data[i][x]); 
        (data_new[categoryID].y).push(this.state.data[i][y]);
        cluster_texts.push(this.state.data[i]["PC1"]);
      }
    }
    for (colID = 0; colID < uniqueTags.length; colID ++){
      data_new.text = cluster_texts;
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

  scatter2dWithColumns = (x, y, distributionData, outliers) => {
    var x1 = [];
    var x2 = [];
    var y1 = [];
    var y2 = [];
    var cluster_texts = [];
    let colors = [];
    if (
      distributionData != null &&
      distributionData.filter((elem) => {
        return elem !== 0 && elem !== 1;
      }).length === 0
    ) {
      // this a boolean data, color everything true or false
      // choose the two representing colors
      colors = [randomColors[0], randomColors[1]];
    }
    if (this.state.data != null && x != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        if (distributionData[i] === 0) {
          x1.push(this.state.data[i][x]);
          y1.push(this.state.data[i][y]);
          cluster_texts.push(this.state.data[i]["MappingID2"]);
        } else {
          x2.push(this.state.data[i][x]);
          y2.push(this.state.data[i][y]);
          cluster_texts.push(this.state.data[i]["MappingID2"]);
        }
      }
      var marker_shape = outliers ? "cross" : "circle";
      var marker_color = outliers ? "#c9d6d3" : colors[1];
      var data1_name = outliers ? "Data" : "True";
      var data2_name = outliers ? "Outliers" : "False";

      var data_new = [
        {
          name: data1_name,
          x: x1,
          y: y1,
          mode: "markers",
          marker: { color: colors[0] },
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        },
        {
          name: data2_name,
          x: x2,
          y: y2,
          mode: "markers",
          marker: { color: marker_color, symbol: marker_shape },

          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
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
    if (this.state.data != null && x != null && y != null && z != null) {
      // console.log(x, y);
      for (var i = 0; i < this.state.data.length; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        z1.push(this.state.data[i][z]);
        cluster_texts.push(this.state.data[i]["MappingID2"]);
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
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
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
        title: "3D scatter plot",
      };
    }

    // console.log("before scatter");
    return <ScatterPlot data={data_new} layout={layout} />;
  };
  scatter3dWithClusters(x, y, z) {
    var x_clusters = [];
    var y_clusters = [];
    var z_clusters = [];

    for (var num_cl = 0; num_cl < num_clusters; num_cl++) {
      x_clusters.push([]);
      y_clusters.push([]);
      z_clusters.push([]);
    }

    var colors = [];

    for (let j = 0; j < num_clusters; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.state.data != null && x != null && y != null) {
      // console.log("inside 3d clustering");
      for (var i = 0; i < this.state.data.length; i++) {
        let rowCol = this.state.clusterColors[i];
        x_clusters[rowCol].push(this.state.data[i][x]);
        y_clusters[rowCol].push(this.state.data[i][y]);
        z_clusters[rowCol].push(this.state.data[i][z]);
      }
      var data_new = [];

      for (var k = 0; k < num_clusters; k += 1) {
        data_new.push({
          name: this.state.cluster_names[k],
          x: x_clusters[k],
          y: y_clusters[k],
          z: z_clusters[k],
          mode: "markers",
          type: "scatter3d",
          marker: { color: colors[k], size: 3 },
        });
      }
    }

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
          title: x,
          type: "linear",
          zeroline: false,
        },
        yaxis: {
          title: y,
          type: "linear",
          zeroline: false,
        },
        zaxis: {
          title: z,
          type: "linear",
          zeroline: false,
        },
      },
      title: "3d point clustering",
    };

    // console.log("before scatter 3d");
    return <ScatterPlot data={data_new} layout={layout} />;
  }

  scatter3dWithColumns = (x, y, z, distributionData, outliers) => {
    var x1 = [];
    var x2 = [];
    var z1 = [];
    var z2 = [];
    var y1 = [];
    var y2 = [];
    var cluster_texts = [];

    let colors = [];

    if (
      distributionData != null &&
      distributionData.filter((elem) => {
        return elem !== 0 && elem !== 1;
      }).length === 0
    ) {
      // this a boolean data, color everything true or false
      // choose the two representing colors
      colors = [randomColors[0], randomColors[1]];
    }
    if (this.state.data != null && x != null && y != null && z != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        if (distributionData[i] === 0) {
          x1.push(this.state.data[i][x]);
          y1.push(this.state.data[i][y]);
          z1.push(this.state.data[i][z]);
          cluster_texts.push(this.state.data[i]["MappingID2"]);
        } else {
          x2.push(this.state.data[i][x]);
          y2.push(this.state.data[i][y]);
          z2.push(this.state.data[i][z]);
          cluster_texts.push(this.state.data[i]["MappingID2"]);
        }
      }
      var marker_shape = outliers ? "cross" : "circle";
      var marker_color = outliers ? "#c9d6d3" : colors[1];
      var data1_name = outliers ? "Data" : "True";
      var data2_name = outliers ? "Outliers" : "False";

      var data_new = [
        {
          name: data1_name,
          x: x1,
          y: y1,
          z: z1,
          mode: "markers",
          type: "scatter3d",
          marker: { color: colors[0], size: 2 },
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        },
        {
          name: data2_name,
          x: x2,
          y: y2,
          z: z2,
          mode: "markers",
          type: "scatter3d",
          marker: { color: marker_color, symbol: marker_shape, size: 2 },
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
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
        title: "3D scatter plot",
      };
    }

    // console.log("before scatter");
    return <ScatterPlot data={data_new} layout={layout} />;
  };

  
  processData = async (dataString, outliers) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
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
      this.setData(list);
      this.setColumns(columns);
    }
  };

  // handle file upload
  handleFileUpload = (e) => {
    // console.log(e);
    this.setState({ selectedFile: e.target.files[0] });
    if (
      this.state.selectedUploadOption === "PCA" ||
      this.state.selectedUploadOption === "t-SNE"
    ) {
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
        this.processData(data, false);
      };
      reader.readAsBinaryString(file);
    } else {
      this.UploadCMDataset(e.target.files[0]);
    }
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
    // console.log("Z change : ", value);
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
  onValueChange1D = (event) => {
    var newSelected = [this.state.selectedColumns, null, null];
    this.setState({
      selectedOption: event.target.value,
      selectedColumns: newSelected,
    });
  };
  onValueChange2D = (event) => {
    var newSelected = this.state.selectedColumns;
    newSelected[2] = null;
    this.setState({
      selectedOption: event.target.value,
      selectedColumns: newSelected,
    });
  };

  onValueChange3D = (event) => {
    this.setState({
      selectedOption: event.target.value,
    });
  };

  formSubmit = (event) => {
    event.preventDefault();
    // console.log(this.state.selectedOption);
  };

  UploadCMDataset = (file) => {
    // Create an object of formData
    const formData = {
      filename: file.name,
    };
    // console.log(file);
    this.setState({ isLoading: true });
    var url = "http://127.0.0.1:5000/";
    if (this.state.DRAlgorithm === "PCA") {
      url = url + "uploadCM";
    } else if (this.state.DRAlgorithm === "t-SNE 2D") {
      url = url + "cmtsne2d";
      // console.log(url);
    } else if (this.state.DRAlgorithm === "t-SNE 3D") {
      url = url + "cmtsne3d";
    }

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        // console.log(r);
        this.setState({ isLoading: false, selectedUploadOption: "PCA" });
        this.processData(r.data, false);
      });
  };

  runKmeans = () => {
    console.log(num_clusters);
    const formData = {
      filename: this.state.selectedFile.name,
      num_clusters: num_clusters,
    };
    this.setState({ isLoading: true });
    axios
      .post("http://127.0.0.1:5000/runkmeans", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        var cluster_names = {}; 
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = index;
        });
        // console.log(r);
        this.setState({
          isLoading: false,
          selectedUploadOption: "PCA",
          clusterColors: r.data,
          cluster_names: cluster_names,
        });
        if (
          this.state.selectedOption === "2D" ||
          this.state.selectedOption === null
        ) {
          // console.log("2d clustering");
          this.scatter2dWithClusters(
            this.state.selectedColumns[0],
            this.state.selectedColumns[1],
            r.data
          );
        } else {
          // console.log("3d clustering");
          this.scatter3dWithClusters(
            this.state.selectedColumns[0],
            this.state.selectedColumns[1],
            this.state.selectedColumns[2],
            r.data
          );
        }
      });
  };
  detectOutliers = () => {
    if (selectedOutlierMethod === "None") {
      this.setOutlierData([]);
    } else {
      const formData = {
        df: this.state.data,
        method: selectedOutlierMethod,
        columnRange : this.state.columnRange,
      };
      this.setState({ isLoading: true });
      axios
        .post("http://127.0.0.1:5000/detectoutliers", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((r) => {
          // console.log(r);
          this.setState({
            isLoading: false,
          });
          this.processData(r.data, true);
        });
    }
  };

  handleSpecificColumns = (event) => {
    console.log(this.state.data);
    this.setState({
      distributionData:
        event.label === "None"
          ? []
          : this.state.data.map(elem => elem[event.label])
    });
  };

  handleDRAChange = (value) => {
    this.setState({ DRAlgorithm: value.label });
  };

  showScatterPlot = () => {
    const x = this.state.selectedColumns[0];
    const y = this.state.selectedColumns[1];
    const z = this.state.selectedColumns[2];
    const distributionData = this.state.distributionData;
    const ONE_DIM = 0; 
    const TWO_DIM = 1; 
    const THREE_DIM = 2; 
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
        this.state.OutlierData.length > 0
      ) {
        if (this.state.OutlierData.length > 0) {
          if (this.state.clusterColors.length > 0) {
            return this.scatterWithClusters(ONE_DIM, x, null, null, true, this.state.OutlierData.map((elem) => {
              return parseInt(elem[x], 10);
            }),);
          }
          else{
            return this.scatter1dWithColumns(
              x,
              this.state.OutlierData.map((elem) => {
                return parseInt(elem[x], 10);
              }),
              true
            );
          }
        } else if (distributionData.length > 0) {
          return this.scatter1dCategorical(x, distributionData, distributionData);
        } else {
          return this.scatterWithClusters(ONE_DIM, x,null, null, false);
        }
      } else {
        return this.scatter1d(x);
      }
    } else if (this.state.selectedColumns[2] === null) {
      if (
        this.state.clusterColors.length > 0 ||
        distributionData.length > 0 ||
        this.state.OutlierData.length > 0
      ) {
        if (this.state.OutlierData.length > 0) {
          if (this.state.clusterColors.length > 0) {
            return this.scatterWithClusters(TWO_DIM, x, y, null, true, this.state.OutlierData.map((elem) => {
              var val1 = parseInt(elem[x], 10) === 1;
              var val2 = parseInt(elem[y], 10) === 1;
              if (this.state.pressed === 1) {
                return val1 || val2 ? 1 : 0;
              } else {
                return val1 && val2 ? 1 : 0;
              }
            }));
          }
          else{
            return this.scatter2dWithColumns(
            x,
            y,
            this.state.OutlierData.map((elem) => {
              var val1 = parseInt(elem[x], 10) === 1;
              var val2 = parseInt(elem[y], 10) === 1;
              if (this.state.pressed === 1) {
                return val1 || val2 ? 1 : 0;
              } else {
                return val1 && val2 ? 1 : 0;
              }
            }),
            true
            );
          }
        } else if (distributionData.length > 0) {
          return this.scatter2dCategorical(x, y, distributionData, distributionData);
        } else {
          return this.scatter2dWithClusters(x, y);
        }
      } else {
        return this.scatter2d(x, y);
      }
    } else {
      if (
        this.state.clusterColors.length > 0 ||
        distributionData.length > 0 ||
        this.state.OutlierData.length > 0
      ) {
        if (this.state.OutlierData.length > 0) {
          var combine_outliers = this.state.OutlierData.map((elem) => {
            var val1 = parseInt(elem[x], 10) === 1;
            var val2 = parseInt(elem[y], 10) === 1;
            var val3 = parseInt(elem[z], 10) === 1;
            if (this.state.pressed === 1) {
              return val1 || val2 || val3 ? 1 : 0;
            } else {
              return val1 && val2 && val3 ? 1 : 0;
            }
          });
          if (this.state.clusterColors.length > 0){
            return this.scatterWithClusters(THREE_DIM, x, y, z, true, combine_outliers);
          }else{
            return this.scatter3dWithColumns(
              x,
              y,
              z,
              combine_outliers,
              true
            );
          }
        } else if (distributionData.length > 0) {
          return this.scatter3dWithColumns(x, y, z, distributionData);
        } else {
          return this.scatter3dWithClusters(x, y, z);
        }
      } else {
        return this.scatter3d(x, y, z);
      }
    }
  };
  IncrementHandler = (data) => {
    console.log(data);
    num_clusters = data.num_clusters;
  };
  handleOutlierColumnChange = (data) => {
    console.log(data);
    this.setState({columnRange: data.columnRange});
  }

  handleTabOutputCallback = (cluster_names) => {
    console.log(cluster_names);
    this.setState({cluster_names: cluster_names});
  }
  
  render() {
    
    return (
      <div style={styles.splitScreen}>
        <div style={styles.leftPane}>
          {this.correlationMatrixUpload()}
          <form style={{ marginTop: "30px" }}>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="Correlation Matrix"
                  checked={
                    this.state.selectedUploadOption === "Correlation Matrix"
                  }
                  onChange={this.onUploadValueChange}
                />
                Correlation Matrix
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="PCA"
                  checked={this.state.selectedUploadOption === "PCA"}
                  onChange={this.onUploadValueChange}
                />
                PCA
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="t-SNE"
                  checked={this.state.selectedUploadOption === "t-SNE"}
                  onChange={this.onUploadValueChange}
                />
                t-SNE
              </label>

              {this.state.selectedUploadOption === "Correlation Matrix" && (
                <div
                  style={{
                    width: "300px",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  <label>Dimensionality Reduction Algorithms</label>
                  <Select
                    name="DRA"
                    placeholder="Algorithm"
                    options={this.state.DRActions}
                    onChange={this.handleDRAChange}
                  />
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              disabled={this.state.selectedUploadOption === null}
              onChange={this.handleFileUpload}
            />
          </form>
          <hr
            style={{
              color: "black",
              backgroundColor: "black",
              width: "40%",
              height: 3,
              opacity: 1,
            }}
          />
          <div
            style={{
              width: "270px",
              paddingVertical: "20px",
            }}
          >
            <label> <h5> Describing Columns </h5></label>
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
          <hr
            style={{
              color: "black",
              backgroundColor: "black",
              width: "40%",
              height: 3,
              opacity: 1,
            }}
          />
          <Incrementor onChange={this.IncrementHandler} />
          <Button variant="outlined"   onClick={this.runKmeans}>Run Kmeans</Button>
          
        </div>

        <div
          className="block-example border border-light"
          style={styles.rightPane}
        >
          {this.state.isLoading && (
            <Loader type="TailSpin" color="#00BFFF" height="100" width="100" />
          )}
          {!this.state.isLoading && (
            <div>
              {this.showScatterPlot()}
              <Tabs style={styles.optionsContainer}>
                  <TabList>
                    <Tab>Settings</Tab>
                    <Tab>Output Options</Tab>
                  </TabList>

                  <TabPanel>
                    <div className="radio" style={styles.dimensions}>
                      <h6>Plot: </h6>
                      <label style={{marginLeft : "10%"}}>
                        <input
                        type="radio"
                        value="1D"
                        checked={this.state.selectedOption === "1D"}
                        onChange={this.onValueChange1D}                        
                      />
                      1D
                    </label>
                    <label style={{marginLeft : "10%"}}>
                      <input
                        type="radio"
                        value="2D"
                        checked={this.state.selectedOption === "2D"}
                        onChange={this.onValueChange2D}
                      />
                      2D
                    </label>
                    <label style={{marginLeft : "10%"}}>
                        <input
                          type="radio"
                          value="3D"
                          checked={this.state.selectedOption === "3D"}
                          onChange={this.onValueChange3D}
                        />
                        3D
                      </label>
                  </div>
                  <div className="row">
                    <div className="row-md-8"></div>

                    <div style={styles.dropDown}>
                      <label style= {{width : '15%', marginLeft: "3%"}} > 
                      <h6> X-axis </h6></label>
                      <div style= {{width : '50%'}} >
                      <Select
                        options={this.state.selectActions}
                        onChange={this.handleSelectXChange}
                      />
                      </div>
                    </div>
                    {(this.state.selectedOption === "2D" ||
                      this.state.selectedOption === "3D") && (
                      <div style={styles.dropDown}>
                        <label style= {{width : '15%', marginLeft: "3%"}} >
                        <h6> Y-axis </h6>
                        </label>
                      <div style= {{width : '50%'}} >
                        <Select
                          options={this.state.selectActions}
                          onChange={this.handleSelectYChange}
                        />
                      </div>
                      </div>
                    )}
                    {this.state.selectedOption === "3D" && (
                      <div style={styles.dropDown}>
                        <label style= {{width : '15%', marginLeft: "3%"}} > 
                        <h6> Z-axis </h6>
                        </label>
                      <div style= {{width : '50%'}} >
                        <Select
                          options={this.state.selectActions}
                          onChange={this.handleSelectZChange}
                        />
                      </div>
                      </div>
                    )}
                    {this.state.multiValue.length > 0 && (
                      <div className="row-md-8" style={styles.dropDown}>
                        <h6>Choose Describing Column</h6>
                        <Select
                          options={this.state.multiValue}
                          onChange={this.handleSpecificColumns}
                        />
                      </div>
                    )}
                  </div>

            <div
              style={{
                width: "90%",
                marginTop: "3%",
                marginLeft: "3%"
              }}
            >
              <h6>Choose the outlier detection method</h6>
              <Select
                options={this.state.selectOutlierActions}
                onChange={this.handleOutlierChange}
              />
              
              <OutlierBlock onChange={this.handleOutlierColumnChange}/>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: '20px'
                }}
              >
                <Button variant="outlined"  
                  onClick={() => this.state.pressed === 0 ? this.setState({ pressed: -1 }) : this.setState({ pressed: 0})}
                  style={{
                    marginTop: "20px",
                    backgroundColor:
                      this.state.pressed === 0 ? "green" : "transparent",
                  }}
                >
                  AND
                </Button>
                <Button variant="outlined"  
                  onClick={() => this.state.pressed === 1 ? this.setState({ pressed: -1 }) : this.setState({ pressed: 1})}
                  style={{
                    marginTop: "20px",
                    backgroundColor:
                      this.state.pressed === 1 ? "green" : "transparent",
                  }}
                >
                  OR
                </Button>
              </div>
              <Button 
                variant="outlined" 
                onClick={this.detectOutliers} 
                style={{ marginLeft: "30%",  }} 
                disabled = {
                  (
                    this.state.pressed !== 0 && 
                    this.state.pressed !== 1
                  ) 
                  || selectedOutlierMethod == null 
                  }
              >
                Detect Outliers
              </Button>
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
                    <TabOutputOptions uniqueClusters = {num_clusters} parentCallback = {this.handleTabOutputCallback} />
                  </TabPanel>
                </Tabs>
            </div>
          )}
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
    height: "100%",
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    padding_top: "20px",
    left: 0,
    width: "40%",
    marginTop: "5%",
    marginLeft: "3%",
  },
  rightPane: {
    height: "85%",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "baseline",
    marginLeft: '3%',
    width: "90%",
  },
  outputSettings:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  dropDown: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: 'baseline'
  },
  optionsContainer: {
    position: "fixed",
    right: "3%",
    top: 0, 
    height: "75%",
    display: "flex",
    flexDirection: "column",
    width: "18%",
    padding: "10px",
    marginTop: "7%",
    backgroundColor: "#ebeff7",
    borderRadius: 10
  },
};
export default App;
