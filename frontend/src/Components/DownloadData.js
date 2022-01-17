import React, { Component } from "react";
import { CSVLink } from "react-csv";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import PropTypes from "prop-types";

class DownloadData extends Component {
  state = {
    outlierCheck: false,
    clusterCheck: false,
    clusterColors: this.props.clusterColors,
    downloadableData: [],
    data: this.props.data,
    columnRange: [1, 2],
    pressed: -1,
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
            disabled={this.state.OutlierData === null}
            onClick={() =>
              this.setState({ outlierCheck: !this.state.outlierCheck })
            }
          />
          Remove Outliers
        </label>
        {this.state.outlierCheck && (
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              justifyContent: "center",
            }}
          >
            <Typography id="range-slider" gutterBottom>
              Columns:
            </Typography>
            <Slider
              value={this.state.columnRange}
              onChange={this.rangeSelector}
              valueLabelDisplay="auto"
              min={1}
              max={20}
            />
            PC{this.state.columnRange[0]} to PC{this.state.columnRange[1]}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <button
                onClick={() => this.setState({ pressed: 0 })}
                style={{
                  marginTop: "20px",
                  backgroundColor:
                    this.state.pressed === 0 ? "green" : "transparent",
                }}
              >
                AND
              </button>
              <button
                onClick={() => this.setState({ pressed: 1 })}
                style={{
                  marginTop: "20px",
                  backgroundColor:
                    this.state.pressed === 1 ? "green" : "transparent",
                }}
              >
                OR
              </button>
            </div>
            <button
              style={{
                marginTop: "20px",
                marginLeft: "50px",
              }}
              onClick={() => {
                var newData = [];
                // console.log(this.props.OutlierData);
                for (var i = 0; i < this.state.data.length; i++) {
                  var row = this.state.data[i];
                  var outlierInp = !this.state.pressed;
                  for (
                    var j = this.state.columnRange[0];
                    j <= this.state.columnRange[1];
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
            >
              APPLY
            </button>
          </div>
        )}
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
              }
            }}
            disabled={this.state.clusterColors.length === 0}
          />
          Include Clustering Info
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

DownloadData.propTypes = {
  data: PropTypes.array,
  OutlierData: PropTypes.array,
  clusterColors: PropTypes.array,
};

const styles = {
  download: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "",
    position: "fixed",
    bottom: "20%",
    right: "30px",
    width: "200px",
  },
};
export default DownloadData;
