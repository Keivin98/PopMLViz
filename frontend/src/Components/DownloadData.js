import React, { Component } from "react";
import { CSVLink } from "react-csv";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

class DownloadData extends Component {
  state = {
    outlierCheck: false,
    clusterCheck: false,
    OutlierData: [],
    clusterColors: [],
    downloadableData: [],
    data: null,
    columnRange: [2, 10],
  };

  rangeSelector = (event, newValue) => {
    this.setState({ columnRange: newValue });
    console.log(newValue);
  };

  render() {
    return (
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
            disabled={this.state.OutlierData === null}
          />
          Remove Outliers
        </label>
        <Typography id="range-slider" gutterBottom>
          Columns:
        </Typography>
        <Slider
          value={this.state.columnRange}
          onChange={this.rangeSelector}
          valueLabelDisplay="auto"
        />
        {this.state.columnRange[0]} to {this.state.columnRange[1]}
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
            disabled={this.state.clusterColors.length === 0}
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
            onClick={() => {
              this.setState({
                clusterCheck: false,
                outlierCheck: false,
              });
            }}
          >
            Download Data
          </CSVLink>
        </button>
      </div>
    );
  }
}
const styles = {
  download: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "",
    position: "fixed",
    bottom: "20%",
    right: "20px",
  },
};
export default DownloadData;
