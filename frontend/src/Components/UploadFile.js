import axios from "axios";
import React, { Component } from "react";
import { CsvToHtmlTable } from "react-csv-to-table";
import { Chart, registerables } from "chart.js";
import * as XLSX from "xlsx";
import Select from "react-select";
import Plot from "react-plotly.js";
import Loader from "react-loader-spinner";
import randomColor from "randomcolor";

Chart.register(...registerables);
// import pca from "../images/pca.p"
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
    selectActions: [],
    selectedColumns: [null, null],
    selectedOption: null,
    selectedUploadOption: null,
    isLoading: false,
    clusterColors: [],
    num_clusters: 0,
    show: true,
  };
  setColumns = (columns) => {
    let act = [];
    for (var i = 0; i < columns.length; i++) {
      act.push({ label: columns[i]["name"], value: i });
    }
    this.setState({ columns: columns, selectActions: act });
  };
  setData = (data) => {
    this.setState({ data: data });
  };
  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    console.log(event.target.files[0]);
  };

  // On file upload (click the upload button)
  CMUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    // Details of the uploaded file
    console.log(this.state.selectedFile);

    // Request made to the backend api
    // Send formData object
    axios
      .post("http://localhost:5000/uploadCM", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return (
          <div>
            <button onClick={this.onFileUpload}>{response.data}</button>
          </div>
        );
      });
  };

  // File content to be displayed after
  // file upload is complete
  correlationMatrixUpload = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
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

  unpack = (rows, key) => {
    return rows.map((row) => {
      return row[key];
    });
  };
  //   scatter2dWithClusters(x, y) {
  //     var x_cluster1 = [];
  //     var x_cluster2 = [];
  //     var x_cluster3 = [];
  //     var x_cluster4 = [];

  //     var y_cluster1 = [];
  //     var y_cluster2 = [];
  //     var y_cluster3 = [];
  //     var y_cluster4 = [];

  //     var colors = [];

  //     for (let j = 0; j < 4; j += 1) {
  //       colors.push(randomColor());
  //     }

  //     if (this.state.data != null && x != null && y != null) {
  //       for (var i = 0; i < this.state.data.length; i++) {
  //         let rowCol = this.state.clusterColors[i];
  //         switch (rowCol) {
  //           case 0:
  //             x_cluster1.push(this.state.data[i][x]);
  //             y_cluster1.push(this.state.data[i][y]);
  //             break;
  //           case 1:
  //             x_cluster2.push(this.state.data[i][x]);
  //             y_cluster2.push(this.state.data[i][y]);
  //             break;
  //           case 2:
  //             x_cluster3.push(this.state.data[i][x]);
  //             y_cluster3.push(this.state.data[i][y]);
  //             break;
  //           case 3:
  //             x_cluster4.push(this.state.data[i][x]);
  //             y_cluster4.push(this.state.data[i][y]);
  //             break;

  //           default:
  //             console.error();
  //         }
  //       }
  //       var data_new = [];
  //       let x_clusters = [x_cluster1, x_cluster2, x_cluster3, x_cluster4];
  //       let y_clusters = [y_cluster1, y_cluster2, y_cluster3, y_cluster4];
  //       for (var k = 0; k < 4; k += 1) {
  //         data_new.push({
  //           name: "Cluster " + k,
  //           x: x_clusters[k],
  //           y: y_clusters[k],
  //           mode: "markers",
  //           marker: { color: colors[k] },
  //         });
  //       }
  //     }

  //     console.log("before scatter");

  //     this.setState({
  //       scatter: <Plot data={data_new} style={styles.scatterContainer} />,
  //     });
  //   }

  scatter2dWithClusters(x, y) {
    var x_clusters = [];
    var y_clusters = [];

    for (
      var num_clusters = 0;
      num_clusters < this.state.num_clusters;
      num_clusters++
    ) {
      x_clusters.push([]);
      y_clusters.push([]);
    }

    var colors = [];

    for (let j = 0; j < this.state.num_clusters; j += 1) {
      colors.push(randomColor());
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
        });
      }
    }

    console.log("before scatter");

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
      colors.push(randomColor());
    }

    if (this.state.data != null && x != null && y != null) {
      console.log("inside 3d clustering");
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
          name: x,
          type: "linear",
          zeroline: false,
        },
        yaxis: {
          name: y,
          type: "linear",
          zeroline: false,
        },
        zaxis: {
          name: z,
          type: "linear",
          zeroline: false,
        },
      },
      title: "3d point clustering",
      width: 800,
    };

    console.log("before scatter 3d");
    this.setState({
      scatter: (
        <Plot data={data_new} layout={layout} style={styles.scatterContainer} />
      ),
    });
  }

  scatter2d = (x, y) => {
    var x1 = [];
    var x2 = [];
    var y1 = [];
    var y2 = [];

    if (this.state.data != null && x != null && y != null) {
      console.log(x, y);
      for (var i = 0; i < this.state.data.length / 2; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
      }
      for (i; i < 7000; i++) {
        x2.push(this.state.data[i][x]);
        y2.push(this.state.data[i][y]);
      }
      var data_new = [
        {
          name: "men",
          x: x1,
          y: y1,
          mode: "markers",
          marker: { color: randomColor() },
        },
        {
          name: "women",
          x: x2,
          y: y2,
          mode: "markers",
          marker: { color: randomColor() },
        },
      ];
    }

    console.log("before scatter");
    this.setState({
      scatter: <Plot data={data_new} style={styles.scatterContainer} />,
    });
  };

  scatter3d = (x, y, z) => {
    var x1 = [];
    var x2 = [];
    var z1 = [];
    var z2 = [];
    var y1 = [];
    var y2 = [];
    if (this.state.data != null && x != null && y != null && z != null) {
      console.log(x, y);
      for (var i = 0; i < this.state.data.length / 2; i++) {
        x1.push(this.state.data[i][x]);
        y1.push(this.state.data[i][y]);
        z1.push(this.state.data[i][z]);
      }
      for (i; i < 7000; i++) {
        x2.push(this.state.data[i][x]);
        y2.push(this.state.data[i][y]);
        z2.push(this.state.data[i][z]);
      }
      var data_new = [
        {
          name: "men",
          x: x1,
          y: y1,
          z: z1,
          mode: "markers",
          type: "scatter3d",
          marker: { color: "red", size: 2 },
        },
        {
          name: "women",
          x: x2,
          y: y2,
          z: z2,
          mode: "markers",
          type: "scatter3d",
          marker: { color: "blue", size: 2 },
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
          },
          yaxis: {
            type: "linear",
            zeroline: false,
          },
          zaxis: {
            type: "linear",
            zeroline: false,
          },
        },
        title: "3D scatter plot",
        width: 800,
      };
    }

    console.log("before scatter");
    this.setState({
      scatter: (
        <Plot data={data_new} layout={layout} style={styles.scatterContainer} />
      ),
    });
  };

  processData = (dataString, colorlabels) => {
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

    this.setData(list);
    // console.log(this.state.data);
    this.setColumns(columns);
    // console.log(this.state.columns);
    // this.scatter2d('PC2', 'PC3');
    // console.log("after scatter");
  };

  // handle file upload
  handleFileUpload = (e) => {
    console.log(e);
    this.setState({ selectedFile: e.target.files[0] });
    if (this.state.selectedUploadOption === "PCA") {
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
        this.processData(data, this.state.clusterColors);
      };
      reader.readAsBinaryString(file);
    } else {
      console.log("nah nah nah");
      this.UploadCMDataset(e.target.files[0]);
    }
  };

  handleSelectXChange = (value) => {
    console.log("x change : ", value);
    this.setState({
      selectedColumns: [
        value.label,
        this.state.selectedColumns[1],
        this.state.selectedColumns[2],
      ],
    });
    if (this.state.selectedColumns[2] === null) {
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
      }
      if (this.state.clusterColors.length === 0) {
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
    console.log("Y change : ", value);
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
    console.log("Z change : ", value);
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
    console.log(this.state.selectedOption);
  };

  UploadCMDataset = (file) => {
    // Create an object of formData
    const formData = {
      filename: file.name,
    };
    console.log(file);
    this.setState({ isLoading: true });

    axios
      .post("http://localhost:5000/uploadCM", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        console.log(r);
        this.setState({ isLoading: false, selectedUploadOption: "PCA" });
        this.processData(r.data, this.state.clusterColors);
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
        console.log(r);
        this.setState({
          isLoading: false,
          selectedUploadOption: "PCA",
          clusterColors: r.data,
        });
        if (
          this.state.selectedOption === "2D" ||
          this.state.selectedOption === null
        ) {
          console.log("2d clustering");
          this.scatter2dWithClusters(
            this.state.selectedColumns[0],
            this.state.selectedColumns[1],
            r.data
          );
        } else {
          console.log("3d clustering");
          this.scatter3dWithClusters(
            this.state.selectedColumns[0],
            this.state.selectedColumns[1],
            this.state.selectedColumns[2],
            r.data
          );
        }
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
  ToggleClick = () => {
    this.setState({ show: !this.state.show });
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
              display: "flex",
              flexDirection: "row",
              width: "40%",
              justifyContent: "space-around",
              marginBottom: "5%",
              height: "30px",
            }}
          >
            Num clusters: <button onClick={this.DecreaseItem}>-</button>
            {this.state.show ? <p>{this.state.num_clusters}</p> : ""}
            <button onClick={this.IncrementItem}> + </button>
          </div>
          <button onClick={this.runKmeans}>Run Kmeans</button>
        </div>

        <div
          className="block-example border border-dark"
          style={styles.rightPane}
        >
          {this.state.isLoading && (
            <Loader type="TailSpin" color="#00BFFF" height="100" width="100" />
          )}
          {/* {this.scatter2d(this.state.selectedColumns[0], this.state.selectedColumns[1])} */}
          {!this.state.isLoading && (
            <div style={styles.rightPane}>
              {this.state.scatter}
              <div className="container" style={styles.optionsContainer}>
                <div className="radio" style={styles.dimensions}>
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
                      style={styles.dropDown}
                    />
                  </div>
                  <div className="row-md-8" style={styles.dropDown}>
                    Y-axis
                    <Select
                      options={this.state.selectActions}
                      onChange={this.handleSelectYChange}
                      style={styles.dropDown}
                    />
                  </div>

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
                </div>
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
    padding: "30px",
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
};
export default App;
