import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Plotly from "plotly.js";

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

class BarPlot extends Component {
  state = {
    numClusters: 2,
    data_new: [],
    positionOfUndefined: 0,
    method: 0,
  };
  range = (start, end) => {
    /* generate a range : [start, start+1, ..., end-1, end] */
    var len = end - start + 1;
    var a = new Array(len);
    for (let i = 0; i < len; i++) a[i] = start + i;
    return a;
  };
  assignClusterToRow1 = (row) => {
    // returns index of maximum value
    // unless max and second max are less than 0.2 apart
    var parsedRow = Object.values(row).map((a) => {
      return parseFloat(a);
    });
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] < this.props.alphaVal / 100) {
      return parsedRow.length;
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
      return parsedRow.length;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  componentDidMount = () => {
    this.setState({ mode: this.props.admixMode });
    this.BarPlot();
  };
  componentDidUpdate(prevProps) {
    console.log(prevProps.certaintyVal, this.props.certaintyVal);
    if (
      prevProps.data !== this.props.data ||
      JSON.stringify(prevProps.clusterNames) !==
        JSON.stringify(this.props.clusterNames) ||
      prevProps.picWidth !== this.props.picWidth ||
      prevProps.picHeight !== this.props.picHeight ||
      prevProps.picFormat !== this.props.picFormat ||
      prevProps.plotTitle !== this.props.plotTitle
    ) {
      this.BarPlot();
    }
    if (prevProps.alphaVal !== this.props.alphaVal) {
      this.setState({ method: 0 });
      this.BarPlot();
    }
    if (prevProps.certaintyVal !== this.props.certaintyVal) {
      this.setState({ method: 1 }, () => this.BarPlot());
    }
    if (prevProps.admixMode !== this.props.admixMode) {
      this.setState({ method: this.props.admixMode }, () => this.BarPlot());
    }
  }
  BarPlot = () => {
    var colors = [];
    var data_new = [];

    if (this.props.data.length > 0 && this.props.data != null) {
      const numClusters = Object.keys(this.props.data[0]).length;

      for (let j = 0; j < numClusters; j += 1) {
        colors.push(randomColors[j]);
      }
      let sortedValues = [];
      let positionOfUndefined = -1;
      if (this.props.admixMode === 0) {
        sortedValues = [...this.props.data].sort((a, b) => {
          return this.assignClusterToRow1(a) > this.assignClusterToRow1(b)
            ? 1
            : -1;
        });
        positionOfUndefined = sortedValues
          .map((x) => this.assignClusterToRow1(x))
          .indexOf(numClusters);
      } else {
        sortedValues = [...this.props.data].sort((a, b) => {
          return this.assignClusterToRow2(a) > this.assignClusterToRow2(b)
            ? 1
            : -1;
        });
        positionOfUndefined = sortedValues
          .map((x) => this.assignClusterToRow2(x))
          .indexOf(numClusters);
        // console.log(positionOfUndefined);
      }

      for (let n = 1; n < numClusters + 1; n += 1) {
        var name = !(n - 1 in this.props.clusterNames)
          ? n - 1 === numClusters
            ? "Undefined Cluster"
            : "Cluster " + (n - 1)
          : this.props.clusterNames[n - 1];
        let y_values = sortedValues.map((x) => x["v" + n]);
        // console.log(positionOfUndefined);
        if (positionOfUndefined <= 0) {
          data_new.push({
            type: "bar",
            name: name,
            x: [
              ...this.range(0, positionOfUndefined),
              ...this.range(
                positionOfUndefined + 5,
                Math.max(y_values.length, positionOfUndefined + 4)
              ),
            ],
            y: y_values,
            marker: {
              opacity: this.range(0, y_values.length).map((x) =>
                x < positionOfUndefined ? 1 : positionOfUndefined < 0 ? 1 : 0.2
              ),
              color: colors[n - 1],
            },
          });
        } else {
          data_new.push({
            type: "bar",
            name: name,
            x: [
              ...this.range(0, positionOfUndefined),
              ...this.range(
                positionOfUndefined + 5,
                Math.max(y_values.length, positionOfUndefined + 4)
              ),
            ],
            y: y_values,
            marker: {
              opacity: this.range(0, y_values.length).map((x) =>
                x < positionOfUndefined ? 1 : 0.2
              ),
              color: colors[n - 1],
            },
          });
        }
      }
      if (positionOfUndefined > 0) {
        data_new.push({
          type: "bar",
          name: "Admixed",
          x: this.range(positionOfUndefined, positionOfUndefined + 5),
          y: [1.1, 1.1, 1.1, 1.1, 1.1],
          base: [-0.05, -0.05, -0.05, -0.05, -0.05],
          marker: {
            color: "black",
          },
        });
      }

      if (this.state.numClusters !== numClusters) {
        this.setState(
          {
            numClusters: numClusters,
            data_new: data_new,
          },
          () => {
            if (this.props.onChange) {
              this.props.onChange(this.state);
            }
          }
        );
      }
      this.setState({
        data_new: data_new,
        positionOfUndefined: positionOfUndefined,
      });
      return Plotly.newPlot(
        "barPlot",
        data_new,
        {
          title: this.props.plotTitle,
          barmode: "stack",
          bargap: 0,
        },
        {
          toImageButtonOptions: {
            filename: this.props.plotTitle,
            width: this.props.picWidth,
            height: this.props.picHeight,
            format: this.props.picFormat,
          },
        }
      );
    }
  };
  render() {
    return <div id="barPlot" style={styles.barContainer}></div>;
  }
}

BarPlot.propTypes = {
  data: PropTypes.array,
  alphaVal: PropTypes.number,
  certaintyVal: PropTypes.number,
  clusterNames: PropTypes.array,
  AdmixOptionsLabelCheck: PropTypes.bool,
  plotTitle: PropTypes.string,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
};

const styles = {
  barContainer: {
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    left: 0,
    marginTop: "13%",
    marginLeft: "21%",
    width: "57%",
    height: "74%",
  },
};
export default BarPlot;
