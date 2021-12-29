import axios from "axios";
import React, { Component } from "react";
import { Chart, registerables } from "chart.js";
import * as XLSX from "xlsx";
import Select from "react-select";
import Plot from "react-plotly.js";
import Loader from "react-loader-spinner";
import { CSVLink } from "react-csv";

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
Chart.register(...registerables);
class App extends Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
    uplaodType: null,
    imageURL: "",
    columns: null,
    data: null,
    scatter: (
      <Plot
        data={[]}
        style={{
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
        }}
      />
    ),
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
    selectedColumns: [null, null],
    selectedOption: null,
    selectedUploadOption: null,
    isLoading: false,
    clusterColors: [],
    num_clusters: 0,
    show: true,
    multiValue: [],
    describingValues: [],
    identifierColumn: "",
    selectedOutlierMethod: null,
    OutlierData: null,
    clusterCheck: false,
    outlierCheck: false,
    downloadableData: null,
  };
  handleMultiChange = (option) => {
    this.setState({
      multiValue: option,
      selectActions: this.state.selectActions.filter((elem) => {
        return option.indexOf(elem) < 0;
      }),
    });
  };
  handleOutlierChange = (option) => {
    this.setState({ selectedOutlierMethod: option.label });
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

  scatter2dWithClusters(x, y) {
    var x_clusters = [];
    var y_clusters = [];
    var cluster_texts = [];
    for (
      var num_clusters = 0;
      num_clusters < this.state.num_clusters;
      num_clusters++
    ) {
      x_clusters.push([]);
      y_clusters.push([]);
      cluster_texts.push([]);
    }

    var colors = [];

    for (let j = 0; j < this.state.num_clusters; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.state.data != null && x != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        let rowCol = this.state.clusterColors[i];
        x_clusters[rowCol].push(this.state.data[i][x]);
        y_clusters[rowCol].push(this.state.data[i][y]);
      }
      var data_new = [];
      for (var k = 0; k < this.state.num_clusters; k += 1) {
        data_new.push({
          name: "Cluster " + k,
          x: x_clusters[k],
          y: y_clusters[k],
          mode: "markers",
          marker: { color: colors[k] },
          text: cluster_texts[k],
        });
      }
    }

    // console.log("before scatter");

    this.setState({
      scatter: (
        <Plot
          data={data_new}
          style={styles.scatterContainer}
          layout={{
            title: "2D plot of " + x + " and " + y,
            xaxis: { title: x },
            yaxis: { title: y },
          }}
        />
      ),
    });
  }

  scatter1dWithClusters(y) {
    var x_clusters = [];
    var y_clusters = [];
    var cluster_texts = [];
    for (
      var num_clusters = 0;
      num_clusters < this.state.num_clusters;
      num_clusters++
    ) {
      x_clusters.push([]);
      y_clusters.push([]);
      cluster_texts.push([]);
    }

    var colors = [];

    for (let j = 0; j < this.state.num_clusters; j += 1) {
      colors.push(randomColors[j]);
    }

    if (this.state.data != null && y != null) {
      for (var i = 0; i < this.state.data.length; i++) {
        let rowCol = this.state.clusterColors[i];
        x_clusters[rowCol].push(i);
        y_clusters[rowCol].push(this.state.data[i][y]);
      }
      var data_new = [];
      for (var k = 0; k < this.state.num_clusters; k += 1) {
        data_new.push({
          name: "Cluster " + k,
          x: x_clusters[k],
          y: y_clusters[k],
          mode: "markers",
          marker: { color: colors[k] },
          text: cluster_texts[k],
        });
      }
    }

    // console.log("before scatter");

    this.setState({
      scatter: <Plot data={data_new} style={styles.scatterContainer} />,
    });
  }

  scatter3dWithClusters(x, y, z) {
    var x_clusters = [];
    var y_clusters = [];
    var z_clusters = [];

    for (
      var num_clusters = 0;
      num_clusters < this.state.num_clusters;
      num_clusters++
    ) {
      x_clusters.push([]);
      y_clusters.push([]);
      z_clusters.push([]);
    }

    var colors = [];

    for (let j = 0; j < this.state.num_clusters; j += 1) {
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

      for (var k = 0; k < this.state.num_clusters; k += 1) {
        data_new.push({
          name: "Cluster " + k,
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
      height: 680,
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
      width: 800,
    };

    // console.log("before scatter 3d");
    this.setState({
      scatter: (
        <Plot data={data_new} layout={layout} style={styles.scatterContainer} />
      ),
    });
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
    // console.log("before scatter");
    this.setState({
      scatter: (
        <Plot
          data={data_new}
          style={styles.scatterContainer}
          layout={{
            title: "2D plot of " + x + " and " + y,
            xaxis: { title: x },
            yaxis: { title: y },
          }}
        />
      ),
    });
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
          //   type: "bar",
        },
      ];
    }
    // console.log("before scatter");
    this.setState({
      scatter: (
        <Plot
          data={data_new}
          style={styles.scatterContainer}
          layout={{
            title: "1D plot of " + y,
            xaxis: { title: "MappingID2" },
            yaxis: { title: y },
          }}
        />
      ),
    });
  };

  scatter2dWithColumns = (x, y, distributionData) => {
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
      var data_new = [
        {
          name: "False",
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
          name: "True",
          x: x2,
          y: y2,
          mode: "markers",
          marker: { color: colors[1] },

          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        },
      ];
    }

    // console.log("before scatter");
    this.setState({
      scatter: (
        <Plot
          data={data_new}
          style={styles.scatterContainer}
          layout={{
            title: "2D plot of " + x + " and " + y,
            xaxis: { title: x },
            yaxis: { title: y },
          }}
        />
      ),
    });
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
      var data1_name = outliers ? "Data" : "False";
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
    this.setState({
      scatter: (
        <Plot
          data={data_new}
          style={styles.scatterContainer}
          layout={{
            title: "1D plot of " + y,
            xaxis: { title: "MappingID2" },
            yaxis: { title: y },
          }}
        />
      ),
    });
  };
  scatter3dWithColumns = (x, y, z, distributionData) => {
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
      var data_new = [
        {
          name: "False",
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
          name: "True",
          x: x2,
          y: y2,
          z: z2,
          mode: "markers",
          type: "scatter3d",
          marker: { color: colors[1], size: 2 },
          text: cluster_texts,
          hovertemplate:
            "<i>(%{x:.4f}, %{y:.4f}) </i>" +
            "<br><b>Mapping ID</b>:%{text}</b></br>",
        },
      ];
      var layout = {
        autosize: true,
        height: 680,
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
        width: 800,
      };
    }

    // console.log("before scatter");
    this.setState({
      scatter: (
        <Plot data={data_new} layout={layout} style={styles.scatterContainer} />
      ),
    });
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
        height: 680,
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
        width: 800,
      };
    }

    // console.log("before scatter");
    this.setState({
      scatter: (
        <Plot data={data_new} layout={layout} style={styles.scatterContainer} />
      ),
    });
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
      //   console.log(this.state.OutlierData);
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
  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  handleSelectXChange = (value) => {
    // console.log("x change : ", value);
    this.setState({
      selectedColumns: [
        value.label,
        this.state.selectedColumns[1],
        this.state.selectedColumns[2],
      ],
    });
    if (
      this.state.selectedColumns[1] === null &&
      this.state.selectedColumns[2] === null
    ) {
      if (
        this.state.clusterColors.length !== 0 ||
        this.state.selectedOutlierMethod !== null
      ) {
        if (this.state.selectedOutlierMethod !== null) {
          this.scatter1dWithColumns(
            value.label,
            this.state.OutlierData.map((elem) => {
              return parseInt(elem[value.label], 10);
            }),
            true
          );
        } else {
          this.scatter1dWithClusters(value.label);
        }
      } else {
        this.scatter1d(value.label);
      }
    } else if (this.state.selectedColumns[2] === null) {
      if (this.state.clusterColors.length === 0) {
        this.scatter2d(value.label, this.state.selectedColumns[1]);
      } else {
        this.scatter2dWithClusters(value.label, this.state.selectedColumns[1]);
      }
    } else {
      if (this.state.clusterColors.length === 0) {
        this.scatter3d(
          value.label,
          this.state.selectedColumns[1],
          this.state.selectedColumns[2]
        );
      } else {
        this.scatter3dWithClusters(
          value.label,
          this.state.selectedColumns[1],
          this.state.selectedColumns[2]
        );
      }
    }

    return this.state.scatter;
  };

  handleSelectYChange = (value) => {
    // console.log("Y change : ", value);
    this.setState({
      selectedColumns: [this.state.selectedColumns[0], value.label, null],
    });
    if (this.state.selectedColumns[2] === null) {
      if (this.state.clusterColors.length === 0) {
        this.scatter2d(this.state.selectedColumns[0], value.label);
      } else {
        this.scatter2dWithClusters(this.state.selectedColumns[0], value.label);
      }
    } else {
      if (this.state.clusterColors.length === 0) {
        this.scatter3d(
          this.state.selectedColumns[0],
          value.label,
          this.state.selectedColumns[2]
        );
      } else {
        this.scatter3dWithClusters(
          this.state.selectedColumns[0],
          value.label,
          this.state.selectedColumns[2]
        );
      }
    }

    return this.state.scatter;
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
    if (this.state.clusterColors.length === 0) {
      this.scatter3d(
        this.state.selectedColumns[0],
        this.state.selectedColumns[1],
        value.label
      );
    } else {
      this.scatter3dWithClusters(
        this.state.selectedColumns[0],
        this.state.selectedColumns[1],
        value.label
      );
    }
    return this.state.scatter;
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
    var url = "http://localhost:5000/";
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
    const formData = {
      filename: this.state.selectedFile.name,
      num_clusters: this.state.num_clusters,
    };
    this.setState({ isLoading: true });
    axios
      .post("http://localhost:5000/runkmeans", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        // console.log(r);
        this.setState({
          isLoading: false,
          selectedUploadOption: "PCA",
          clusterColors: r.data,
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
  //   runPCA = () => {
  //     this.UploadCMDataset(this.state.selectedFile);
  //   };
  detectOutliers = () => {
    const formData = {
      df: this.state.data,
      method: this.state.selectedOutlierMethod,
    };
    this.setState({ isLoading: true });
    axios
      .post("http://localhost:5000/detectoutliers", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        // console.log(r);
        this.setState({ isLoading: false });
        this.processData(r.data, true);
        this.scatter1dWithColumns(
          this.state.selectedColumns[0],
          this.state.OutlierData.map((value) => {
            return parseInt(value[this.state.selectedColumns[0]], 10);
          }),
          true
        );
      });
  };
  IncrementItem = () => {
    this.setState({ num_clusters: this.state.num_clusters + 1 });
  };
  DecreaseItem = () => {
    if (!(this.state.num_clusters <= 0)) {
      this.setState({ num_clusters: this.state.num_clusters - 1 });
    }
  };

  handleSpecificColumns = (event) => {
    let distributionData = this.state.data.map((elem) => {
      return parseInt(elem[event.label], 10);
    });
    // console.log(distributionData);
    if (
      this.state.selectedOption === "1D" ||
      this.state.selectedOption === null
    ) {
      // console.log("1d with columns");
      this.scatter1dWithColumns(
        this.state.selectedColumns[0],
        distributionData
      );
    } else if (this.state.selectedOption === "2D") {
      // console.log("2d with columns");
      this.scatter2dWithColumns(
        this.state.selectedColumns[0],
        this.state.selectedColumns[1],
        distributionData
      );
    } else {
      // console.log("3d with columns");
      this.scatter3dWithColumns(
        this.state.selectedColumns[0],
        this.state.selectedColumns[1],
        this.state.selectedColumns[2],
        distributionData
      );
    }
  };

  handleDRAChange = (value) => {
    this.setState({ DRAlgorithm: value.label });
  };

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
              height: 5,
              opacity: 1,
            }}
          />
          <div
            style={{
              width: "300px",
              paddingVertical: "20px",
            }}
          >
            <label>Describing Columns</label>
            <Select
              name="filters"
              placeholder="Filters"
              value={this.state.multiValue}
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
              height: 5,
              opacity: 1,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "40%",
              justifyContent: "space-between",
              marginBottom: "5%",
              height: "50px",
              paddingTop: "20px",
            }}
          >
            Num clusters: <button onClick={this.DecreaseItem}>-</button>
            {this.state.show ? <p>{this.state.num_clusters}</p> : ""}
            <button onClick={this.IncrementItem}> + </button>
          </div>
          <button onClick={this.runKmeans}>Run Kmeans</button>
          <hr
            style={{
              color: "black",
              backgroundColor: "black",
              width: "40%",
              height: 5,
              opacity: 1,
            }}
          />
          <div
            style={{
              width: "300px",
              paddingVertical: "20px",
            }}
          >
            Choose the outlier detection method
            <Select
              options={this.state.selectOutlierActions}
              onChange={this.handleOutlierChange}
            />
            <button onClick={this.detectOutliers} style={{ marginTop: "20px" }}>
              Detect Outliers
            </button>
          </div>
        </div>

        <div
          className="block-example border border-dark"
          style={styles.rightPane}
        >
          {this.state.isLoading && (
            <Loader type="TailSpin" color="#00BFFF" height="100" width="100" />
          )}
          {!this.state.isLoading && (
            <div style={styles.rightPane}>
              {this.state.scatter}
              <div className="container" style={styles.optionsContainer}>
                <div className="radio" style={styles.dimensions}>
                  <label>
                    <input
                      type="radio"
                      value="1D"
                      checked={this.state.selectedOption === "1D"}
                      onChange={this.onValueChange1D}
                    />
                    1D
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="2D"
                      checked={this.state.selectedOption === "2D"}
                      onChange={this.onValueChange2D}
                    />
                    2D
                  </label>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        value="3D"
                        checked={this.state.selectedOption === "3D"}
                        onChange={this.onValueChange3D}
                      />
                      3D
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="row-md-8"></div>

                  <div className="row-md-8" style={styles.dropDown}>
                    X-axis
                    <Select
                      options={this.state.selectActions}
                      onChange={this.handleSelectXChange}
                    />
                  </div>
                  {(this.state.selectedOption === "2D" ||
                    this.state.selectedOption === "3D") && (
                    <div className="row-md-8" style={styles.dropDown}>
                      Y-axis
                      <Select
                        options={this.state.selectActions}
                        onChange={this.handleSelectYChange}
                      />
                    </div>
                  )}
                  {this.state.selectedOption === "3D" && (
                    <div className="row-md-8" style={styles.dropDown}>
                      Z-axis
                      <Select
                        options={this.state.selectActions}
                        onChange={this.handleSelectZChange}
                        style={styles.dropDown}
                      />
                    </div>
                  )}
                  {this.state.multiValue.length > 0 && (
                    <div className="row-md-8" style={styles.dropDown}>
                      Choose Describing Column
                      <Select
                        options={this.state.multiValue}
                        onChange={this.handleSpecificColumns}
                        style={styles.dropDown}
                      />
                    </div>
                  )}
                </div>

                {this.state.data !== null && (
                  <div style={styles.download}>
                    <label>
                      <input
                        name="outliers"
                        type="checkbox"
                        checked={this.state.outlierCheck}
                        onChange={() => {
                          var newData = [];
                          for (var i = 0; i < this.state.data.length; i++) {
                            var row = this.state.data[i];
                            row = {
                              ...row,
                              outlier: this.state.OutlierData[i],
                            };
                            newData = [...newData, row];
                          }
                          this.setState({
                            outlierCheck: !this.state.outlierCheck,
                            downloadableData: this.state.OutlierData,
                          });
                        }}
                      />
                      Remove Outliers
                    </label>
                    <label>
                      <input
                        name="clustering"
                        type="checkbox"
                        checked={this.state.clusterCheck}
                        onChange={() => {
                          var newData = [];
                          for (var i = 0; i < this.state.data.length; i++) {
                            var row = this.state.data[i];
                            row = {
                              ...row,
                              cluster: this.state.clusterColors[i],
                            };
                            newData = [...newData, row];
                          }
                          this.setState({
                            clusterCheck: !this.state.clusterCheck,
                            downloadableData: newData,
                          });
                        }}
                      />
                      Include Clustering Information
                    </label>

                    <button>
                      <CSVLink
                        data={
                          this.state.downloadableData === null
                            ? this.state.data
                            : this.state.downloadableData
                        }
                      >
                        Download Data
                      </CSVLink>
                    </button>
                  </div>
                )}
              </div>
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
    backgroud_color: "red",
    width: "40%",
    marginTop: "5%",
    marginLeft: "5%",
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
  },
  radioButtons: {
    display: "flex",
    flexDirection: "column",
    color: "blue",
    marginTop: "10px",
  },
  dimensions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  dropDown: {
    width: "200px",
  },
  optionsContainer: {
    height: "45%",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    top: 0,
    right: 0,
    width: "15%",
    marginTop: "5%",
    justifyContent: "center",
  },
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
  download: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "",
    position: "fixed",
    bottom: "20%",
    right: "20px",
  },
};
export default App;
