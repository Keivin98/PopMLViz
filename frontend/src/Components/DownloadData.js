import React, { Component } from "react";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
class DownloadData extends Component {
  state = {
    outlierCheck: false,
    clusterCheck: false,
    clusterColors: this.props.clusterColors,
    downloadableData: [],
    data: this.props.data,
    pressed: -1,
  };

  rangeSelector = (event, newValue) => {
    this.setState({ columnRange: newValue });
    console.log(newValue);
  };

  render() {
    return (
      <div className="block-example border-light" style={styles.download}>
        <label>
          <input
            name="outliers"
            type="checkbox"
            checked={this.state.outlierCheck}
            readOnly={true}
            disabled={this.props.OutlierData.length === 0}
            onClick={() =>
              {this.setState({ outlierCheck: !this.state.outlierCheck })
              var newData = [];
                // console.log(this.props.OutlierData);
                for (var i = 0; i < this.state.data.length; i++) {
                  var row = this.state.downloadableData.length > 0 ? this.state.downloadableData[i] : this.state.data[i];
                  var outlierInp = !this.state.pressed;
                  for (
                    var j = this.props.columnRange[0];
                    j <= this.props.columnRange[1];
                    j++
                  ) {
                    if (this.state.pressed === 0) {
                      outlierInp =
                        outlierInp &&
                        this.props.OutlierData[i]["PC" + j.toString()];
                    } else {
                      outlierInp =
                        outlierInp ||
                        this.props.OutlierData[i]["PC" + j.toString()];
                    }
                  }
                  row = {
                    ...row,
                    outlier: outlierInp,
                  };
                  newData = [...newData, row];
                }
                this.setState({
                  downloadableData: newData,
                });
              }}
          />
          {"\t"} Remove Outliers
        </label>
        <label>
          <input
            name="clustering"
            type="checkbox"
            checked={this.state.clusterCheck}
            onChange={() => {
              if (this.state.clusterCheck) {
                this.setState({
                  clusterCheck: !this.state.clusterCheck,
                });
              } else {
                var newData = [];
                for (var i = 0; i < this.state.data.length; i++) {
                  var row = this.state.downloadableData.length > 0 ? this.state.downloadableData[i] : this.state.data[i];
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
            }}
            disabled={this.props.clusterColors.length === 0}
          />
          {"\t"} Include Clustering Info
        </label>
        <Button variant="outlined">
          <CSVLink
            data={
              this.state.downloadableData.length === 0
                ? this.state.data
                : this.state.downloadableData
            }
            onClick={() => {
              this.setState({
                clusterCheck: false,
                outlierCheck: false,
                // downloadableData: []
              });
            }}
          >
            Download Data
          </CSVLink>
        </Button>
      </div>
    );
  }
}

DownloadData.propTypes = {
  data: PropTypes.array,
  OutlierData: PropTypes.array,
  clusterColors: PropTypes.array,
  columnRange: PropTypes.array,
  clusterNames: PropTypes.object,
};

const styles = {
  download: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    bottom: "6%",
    right: "4%",
    width: "15%",
    padding: '20px',
    border: `3px solid`,
    borderRadius: 10
  },
};
export default DownloadData;
