import React, { Component } from "react";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
class DownloadData extends Component {
  state = {
    outlierCheck: false,
    clusterCheck: false,
    admixCheck: false,
    clusterColors: this.props.clusterColors,
    downloadableData: [],
    data: this.props.data,
    pressed: -1,
    admix: [],
    alphaVal: 40,
    certaintyVal: 40,
  };

  rangeSelector = (event, newValue) => {
    this.setState({ columnRange: newValue });
  };
  componentDidMount = () => {
    this.setState({
      admix: this.props.admixData,
      downloadableData: this.props.data,
      alphaVal: this.props.alphaVal,
      certaintyVal: this.props.certaintyVal,
      admixMode: this.props.admixMode,
    });
  };
  componentDidUpdate = (prevProps) => {
    // this.setState({ admix: this.props.admixData });
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.setState({ downloadableData: this.props.data });
    }
    if (
      prevProps.alphaVal !== this.props.alphaVal ||
      prevProps.certaintyVal !== this.props.certaintyVal ||
      prevProps.admixMode !== this.props.admixMode
    ) {
      this.setState({
        admixMode: this.props.admixMode,
        alphaVal: this.props.alphaVal,
        certaintyVal: this.props.certaintyVal,
      });
    }
  };

  removeOutliers = () => {
    this.setState({ outlierCheck: !this.state.outlierCheck });
    var newData = [];
    for (var i = 0; i < this.state.data.length; i++) {
      var row =
        this.state.downloadableData.length > 0
          ? this.state.downloadableData[i]
          : this.state.data[i];
      if (!this.state.clusterCheck) {
        row = Object.fromEntries(
          Object.entries(row).filter(([key]) => key !== "cluster")
        );
      }
      var outlierInp = this.props.OutlierData[i];
      row = {
        ...row,
        outlier: outlierInp,
      };
      newData = [...newData, row];
    }
    this.setState({
      downloadableData: newData,
    });
  };

  detectClusters = () => {
    if (this.state.clusterCheck) {
      this.setState({
        clusterCheck: !this.state.clusterCheck,
      });
    } else {
      var newData = [];
      for (var i = 0; i < this.state.data.length; i++) {
        var row =
          this.state.downloadableData.length > 0
            ? this.state.downloadableData[i]
            : this.state.data[i];
        if (!this.state.outlierCheck) {
          row = Object.fromEntries(
            Object.entries(row).filter(([key]) => key !== "outlier")
          );
        }
        row = {
          ...row,
          cluster: this.props.clusterNames[this.props.clusterColors[i]],
        };
        newData = [...newData, row];
      }
      this.setState({
        clusterCheck: !this.state.clusterCheck,
        downloadableData: newData,
      });
    }
  };
  assignClusterToRow1 = (row) => {
    // returns index of maximum value
    // unless max and second max are less than 0.2 apart
    var parsedRow = Object.values(row).map((a) => {
      return parseFloat(a);
    });
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] < this.props.alphaVal / 100) {
      return -1;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };
  assignClusterToRow2 = (row) => {
    // returns index of maximum value
    // unless max and second max are less than 0.2 apart
    var parsedRow = Object.values(row).map((a) => {
      return parseFloat(a);
    });
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] - rowDescending[1] < this.props.certaintyVal / 100.0) {
      return -1;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  mergeData = (allData, additionalColumn) => {
    // console.log(this.props.clusterNames, additionalColumn);
    const undefiendValue = -1;
    return [...allData].map((elem, index) => {
      return Object.assign({}, elem, {
        admixCluster:
          additionalColumn[index] === undefiendValue
            ? "undefined"
            : this.props.clusterNames[Number(additionalColumn[index])] ===
              undefined
            ? additionalColumn[index]
            : this.props.clusterNames[additionalColumn[index]],
      });
    });
  };

  admixClustering = () => {
    if (this.state.admixCheck) {
      this.setState({
        admixCheck: !this.state.admixCheck,
      });
    } else {
      var clusters = [];
      for (var i = 0; i < this.props.admixData.length; i++) {
        var row_i = this.props.admixData[i];
        if (this.props.admixMode === 0) {
          var cluster = this.assignClusterToRow1(row_i);
        } else {
          var cluster = this.assignClusterToRow2(row_i);
        }
        clusters.push(cluster);
      }
      var mergedData =
        this.state.downloadableData.length > 0
          ? this.mergeData(this.state.downloadableData, clusters)
          : this.mergeData(this.state.data, clusters);
      this.setState({
        downloadableData: mergedData,
        admixCheck: !this.state.admixCheck,
      });
    }
  };

  render() {
    return (
      <div>
        <div className="block-example border-light" style={styles.download}>
          <label>
            <input
              name="outliers"
              type="checkbox"
              checked={this.state.outlierCheck}
              disabled={this.props.OutlierData.length === 0}
              onClick={this.removeOutliers}
            />
            {"\t"} Remove Outliers
          </label>
          <label>
            <input
              name="clustering"
              type="checkbox"
              checked={this.state.clusterCheck}
              onChange={this.detectClusters}
              disabled={this.props.clusterColors.length === 0}
            />
            {"\t"} Include Clustering Info
          </label>
          <label>
            <input
              name="clustering"
              type="checkbox"
              checked={this.state.admixCheck}
              onChange={this.admixClustering}
              disabled={this.props.admixData.length === 0}
            />
            {"\t"} Include Admix Clustering
          </label>
          <Button variant="outlined">
            <CSVLink
              data={
                this.state.downloadableData.length === 0
                  ? this.state.data
                  : this.state.downloadableData
              }
              filename={"popmlvis_analysis.csv"}
              onClick={() => {
                this.setState({
                  clusterCheck: false,
                  outlierCheck: false,
                });
              }}
            >
              Download Data
            </CSVLink>
          </Button>
        </div>
      </div>
    );
  }
}

DownloadData.propTypes = {
  data: PropTypes.array,
  OutlierData: PropTypes.array,
  clusterColors: PropTypes.array,
  clusterNames: PropTypes.object,
  admixData: PropTypes.array,
  alphaVal: PropTypes.number,
  certaintyVal: PropTypes.number,
  admixMode: PropTypes.number,
};

const styles = {
  download: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    bottom: "6%",
    right: "4%",
    width: "15%",
    padding: "20px",
    border: `3px solid`,
    borderRadius: 10,
  },
};
export default DownloadData;
